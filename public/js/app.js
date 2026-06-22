console.log("Capacitor =", window.Capacitor)

setTimeout(() => {
    console.log("Plugins =", window.Capacitor?.Plugins)
}, 2000)

console.log("Capacitor:", window.Capacitor)

if (window.Capacitor) {
    alert("Capacitor APK terdeteksi")
}

const start = document.getElementById("start")
const welcome = document.getElementById("welcome")
const home = document.getElementById("home")
const bar = document.getElementById("bar")
const list = document.getElementById("music-list")
const play = document.getElementById("play")
const fullPlayer = document.getElementById("fullPlayer")
const closePlayer = document.getElementById("closePlayer")
const prev = document.getElementById("prev")
const next = document.getElementById("next")
const progress = document.getElementById("progress")
/*const ringProgress = document.querySelector(".ring-progress")
console.log("Ring:", ringProgress)*/
const radius = 46
const circumference = 2 * Math.PI * radius
const uploadProgress = document.getElementById("uploadProgress")
/*ringProgress.style.strokeDasharray = circumference
ringProgress.style.strokeDashoffset = circumference*/
const nowTitle = document.getElementById("nowTitle")
const menuFavorite = document.getElementById("menuFavorite")
const search = document.getElementById("search")

document.getElementById(
"openFullPlayer"
).onclick = ()=>{

fullPlayer.classList.add(
"show"
)

document
.querySelector(".player")
.classList.add(
"hidden"
)

}

closePlayer.onclick = ()=>{

fullPlayer.classList.remove(
"show"
)

document
.querySelector(".player")
.classList.remove(
"hidden"
)

}

let selectedPlaylistId = null
let selectedSongUrl = null
let selectedSong = null
let audio = new Audio()
let playing = false
let allSongs = []
let shuffledSongs = []
let loadedSongs = 0
const SONGS_PER_LOAD = 10
let currentList = []
let currentIndex = -1
let animateCards = true
let currentSongUrl = ""
let allPlaylists = []
let playlists = []
let favorites = []
let favoritePlaylists = []
let currentPlaylistId = null
let currentPage = "home"
let downloadPlaylists =
JSON.parse(
localStorage.getItem(
"downloadPlaylists"
)
) || []

let downloads =
JSON.parse(
localStorage.getItem(
"downloads"
)
) || []

window.onerror = function(msg,url,line){

alert(
"ERROR:\n" +
msg +
"\nLINE: " +
line
)

}

// Splash Screen

let persen = 0

const animasi = setInterval(() => {

    persen++

    bar.style.width = persen + "%"

    if (persen >= 100) {

        clearInterval(animasi)

        document.getElementById(
            "loadingText"
        ).innerHTML =
            "Siap digunakan"

        start.style.display = "block"

    }

}, 30)

start.onclick = () => {

    welcome.classList.add(
        "hide-welcome"
    )

    setTimeout(() => {

        welcome.style.display =
            "none"

        home.classList.add(
            "show-home"
        )

        document.getElementById(
        "settingBtn"
        ).style.display = "block"

        document
            .querySelector(".player")
            .classList.add(
                "player-show"
            )

    }, 800)

}

function showPlaylistMenu(id){

selectedPlaylistId = id

updatePlaylistMenu()

document
.getElementById(
"playlistMenuPopup"
)
.style.display = "flex"

}

window.showPlaylistMenu =
showPlaylistMenu

function updatePlaylistMenu(){

const favBtn =
document.getElementById(
"playlistFavBtn"
)

const downloadBtn =
document.getElementById(
"playlistDownloadBtn"
)

if(
favoritePlaylists.includes(
selectedPlaylistId
)
){

favBtn.innerText =
"❌ Hapus Favorit"

}else{

favBtn.innerText =
"⭐ Tambah Favorit"

}

if(
downloadPlaylists.includes(
selectedPlaylistId
)
){

downloadBtn.innerText =
"❌ Hapus Download"

}else{

downloadBtn.innerText =
"⬇ Download Playlist"

}

}

function closePlaylistMenu(){

document
.getElementById(
"playlistMenuPopup"
)
.style.display = "none"

}

//loadplaylist
async function loadAllPlaylists(){

const res =
await fetch(
"/api/all-playlists"
)

allPlaylists =
await res.json()

}

//playlists
async function loadPlaylists(){

const user =
JSON.parse(
localStorage.getItem(
"user"
)
)

if(!user)return

const res =
await fetch(
`/api/playlists/${user.id}`
)

playlists =
await res.json()

}

// fav
async function loadFavorites(){

try{

const user =
JSON.parse(
localStorage.getItem(
"user"
)
)

if(!user)return

const res =
await fetch(
`/api/favorites/${user.id}`
)

favorites =
await res.json()

}catch(err){

console.log(
"Favorite Error:",
err
)

}

}

async function loadFavoritePlaylists(){

const user =
JSON.parse(
localStorage.getItem(
"user"
)
)

if(!user)return

const res =
await fetch(
`/api/favorite-playlists/${user.id}`
)

favoritePlaylists =
await res.json()

}

async function loadDownloadPlaylists(){

const user =
JSON.parse(
localStorage.getItem(
"user"
)
)

if(!user)return

const res =
await fetch(
`/api/download-playlists/${user.id}`
)

downloadPlaylists =
await res.json()

}

async function saveFavoritePlaylists(){

const user =
JSON.parse(
localStorage.getItem(
"user"
)
)

if(!user)return

await fetch(
"/api/favorite-playlists",
{
method:"POST",
headers:{
"Content-Type":
"application/json"
},
body:JSON.stringify({

userId:user.id,

favoritePlaylists

})
}
)

}

async function saveDownloadPlaylists(){

const user =
JSON.parse(
localStorage.getItem(
"user"
)
)

if(!user)return

await fetch(
"/api/download-playlists",
{
method:"POST",
headers:{
"Content-Type":
"application/json"
},
body:JSON.stringify({

userId:user.id,

downloadPlaylists

})
}
)

}

async function togglePlaylistDownload(id){

const playlist =
allPlaylists.find(
p => p.id == id
)

if(!playlist)return

if(
downloadPlaylists.includes(id)
){

downloadPlaylists =
downloadPlaylists.filter(
p => p !== id
)

alert(
"Playlist dihapus dari Download"
)

}else{

downloadPlaylists.push(id)

playlist.songs.forEach(
url=>{

if(
!downloads.includes(url)
){

downloads.push(url)

}

}
)

localStorage.setItem(
"downloads",
JSON.stringify(
downloads
)
)

alert(
"Playlist ditambahkan ke Download"
)

}

saveDownloadPlaylists()
updatePlaylistMenu()
showPlaylists()

}

async function deletePlaylist(id){

const playlist =
playlists.find(
p => p.id == id
)

if(!playlist)return

if(
!confirm(
`Hapus playlist "${playlist.name}" ?`
)
)return

playlists =
playlists.filter(
p => p.id != id
)

favoritePlaylists =
favoritePlaylists.filter(
p => p != id
)

downloadPlaylists =
downloadPlaylists.filter(
p => p != id
)

await savePlaylists()
await loadAllPlaylists()
await saveFavoritePlaylists()
await saveDownloadPlaylists()

closePlaylistMenu()

showPlaylists()

}

function saveDownloadPlaylists(){

localStorage.setItem(

"downloadPlaylists",

JSON.stringify(
downloadPlaylists
)

)

}

function shuffleArray(array){

return [...array].sort(
()=> Math.random() - 0.5
)

}

// Load Lagu
async function loadSongs() {

    const response =
        await fetch("/api/songs")

    allSongs =
        await response.json()

    currentPage = "home"

    shuffledSongs =
    shuffleArray(allSongs)

    loadedSongs =
    SONGS_PER_LOAD

    renderSongs(

    shuffledSongs.slice(
    0,
    loadedSongs
    )

    )

}

console.log(allPlaylists)
function showPlaylists(){

list.innerHTML = ""

allPlaylists.forEach(
playlist=>{

list.innerHTML += `

<div class="playlist-card">

<div
class="playlist-info"
onclick="
openPlaylist(
${playlist.id}
)
"
>

${playlist.name}

(${playlist.songs.length} lagu)

</div>

<button
class="playlist-menu-btn"
onclick="
event.stopPropagation();
showPlaylistMenu(
${playlist.id}
)
"
>

⋮

</button>

</div>

`

}

)

}

function showFavoritePlaylists(){

currentPage = "favoritePlaylists"

list.innerHTML = `

<div
class="playlist-back"
onclick="menuFavorite.click()"
>

⬅ Kembali

</div>

`
const favLists =
allPlaylists.filter(
playlist =>
favoritePlaylists.includes(
playlist.id
)
)

favLists.forEach(
playlist=>{

list.innerHTML += `

<div
class="playlist-card"
onclick="openPlaylist(${playlist.id})"
>

${playlist.name}

(${playlist.songs.length} lagu)

</div>

`

})

}

function showDownloadPlaylists(){

currentPage = "downloadPlaylists"

list.innerHTML = `

<div
class="playlist-back"
onclick="menuDownload.click()"
>

⬅ Kembali

</div>

`

const downloadLists =
allPlaylists.filter(
playlist =>
downloadPlaylists.includes(
playlist.id
)
)

downloadLists.forEach(
playlist=>{

list.innerHTML += `

<div
class="playlist-card"
onclick="openPlaylist(${playlist.id})"
>

${playlist.name}

(${playlist.songs.length} lagu)

</div>

`

})

}

function openPlaylist(id){

currentPlaylistId = id
currentPage = "playlist"

const playlist =
allPlaylists.find(
p => p.id == id
)

if(!playlist)return

const songs =
allSongs.filter(
song => {

const songName =
decodeURIComponent(
song.url.split("/").pop()
)

return playlist.songs.some(
url => {

const playlistName =
decodeURIComponent(
url.split("/").pop()
)

return playlistName === songName

})

}
)

renderSongs(songs)

}

async function togglePlaylistFavorite(id){

if(
favoritePlaylists.includes(id)
){

favoritePlaylists =
favoritePlaylists.filter(
p=>p!==id
)

}else{

favoritePlaylists.push(id)

}

await saveFavoritePlaylists()
updatePlaylistMenu()
showPlaylists()

}

function renderSongs(data) {

currentList = data

    list.innerHTML = ""

const user =
JSON.parse(
localStorage.getItem(
"user"
)
)

if(
user &&
currentPage === "home"
){

list.innerHTML += `

<div
class="playlist-card"
onclick="showPlaylists()"
>

Playlists
(${allPlaylists.length})

</div>

`

}

if(
currentPage === "favorites" &&
favoritePlaylists.length > 0
){

list.innerHTML += `

<div
class="playlist-card"
onclick="showFavoritePlaylists()"
>

Playlist Favorit
(${favoritePlaylists.length})

</div>

`

}

    data.forEach((song,index)=>{

        list.innerHTML += `

<div class="music-card"
id="song-${index}"
onclick="playSongByIndex(${index})">

<div class="cover">
  <img src="${song.cover || '/default.png'}"
       onerror="this.src='/default.png'">
</div>

<div class="info">

<div
class="song ${
song.url === currentSongUrl
? 'playing-song'
: ''
}">

${song.title}

</div>

<div class="artist">
${song.artist}
</div>

</div>

<button
class="song-menu"
onclick="
event.stopPropagation();
showSongMenu(
'${song.url}'
)
">

⋮

</button>

</div>

</div>

`

    })

animateCards = false
if(currentIndex >= 0){

const activeTitle =
document.getElementById(
`song-title-${currentIndex}`
)

if(activeTitle){

activeTitle.classList.add(
"playing-song"
)

}

}

}

function toggleFavorite(
url
){

if(
favorites.includes(
url
)
){

favorites =
favorites.filter(
item =>
item != url
)

}else{

favorites.push(
url
)

}

localStorage.setItem(

"favorites",

JSON.stringify(
favorites
)

)

if(currentPage === "playlist" && currentPlaylistId){

openPlaylist(currentPlaylistId)

}else if(currentPage === "favorites"){

menuFavorite.click()

}else{

renderSongs(allSongs)

}

const user =
JSON.parse(
localStorage.getItem(
"user"
)
)

if(user){

fetch(
"/api/favorites",
{
method:"POST",

headers:{
"Content-Type":
"application/json"
},

body:JSON.stringify({

userId:user.id,

favorites

})

}
)

}

}

function toggleDownload(url){

if(
downloads.includes(url)
){

downloads =
downloads.filter(
x => x != url
)

alert(
"Lagu dihapus dari Download"
)

}else{

downloads.push(url)

alert(
"Lagu ditambahkan ke Download"
)

}

localStorage.setItem(
"downloads",
JSON.stringify(
downloads
)

)

//renderSongs(allSongs)

}

function showSongMenu(url){

selectedSongUrl = url

selectedSong =
allSongs.find(
song => song.url === url
)

console.log(selectedSong)

document
.getElementById(
"songMenuPopup"
)
.style.display =
"flex"

}

function closeSongMenu(){

document
.getElementById(
"songMenuPopup"
)
.style.display =
"none"

}

function showPlaylistSelector(){
alert("masuk")
closeSongMenu()

if(
playlists.length === 0
){

alert(
"Buat playlist dulu"
)

return

}

let text =
"Pilih Playlist:\n\n"

playlists.forEach(
(p,i)=>{

text +=
`${i+1}. ${p.name}\n`

}
)

const pilih =
prompt(text)

if(!pilih)return

const playlist =
playlists[
parseInt(pilih)-1
]

if(!playlist)return

addSongToPlaylist(
playlist.id
)

}

async function addSongToPlaylist(
playlistId
){

const playlist =
playlists.find(
p =>
p.id == playlistId
)

if(!playlist)
return

if(
playlist.songs.includes(
selectedSongUrl
)
){

alert(
"Lagu sudah ada"
)

return

}

playlist.songs.push(
selectedSongUrl
)

const user =
JSON.parse(
localStorage.getItem(
"user"
)
)

const res =
await fetch(
"/api/playlists",
{
method:"POST",
headers:{
"Content-Type":
"application/json"
},
body:JSON.stringify({

userId:user.id,

playlists

})
}
)

const data =
await res.json()

if(data.success){

await loadPlaylists()

await loadAllPlaylists()

alert(
"Berhasil ditambahkan"
)

openPlaylist(
playlistId
)

}else{

alert(
"Gagal"
)

}

}

// Search

search.oninput = () => {

    const q =
        search.value.toLowerCase()

    renderSongs(

        allSongs.filter(
            song =>
                song.title
                .toLowerCase()
                .includes(q)
        )

    )

}

menuFavorite.onclick=()=>{

    currentPage = "favorites"

    const data =
    allSongs.filter(
    song =>
    favorites.includes(
    song.url
    )
    )

    renderSongs(data)

}

const menuAll =
document.getElementById(
"menuAll"
)

menuAll.onclick=()=>{

currentPage = "home"

shuffledSongs =
shuffleArray(allSongs)

loadedSongs =
SONGS_PER_LOAD

    renderSongs(
        shuffledSongs.slice(
            0,
            loadedSongs
        )
    )

}

const menuDownload =
document.getElementById(
"menuDownload"
)

menuDownload.onclick=()=>{

currentPage = "downloads"

list.innerHTML = `

<div
class="playlist-card"
onclick="showDownloadPlaylists()"
>

Playlist Download
(${downloadPlaylists.length})

</div>

<div
class="playlist-card"
onclick="showDownloadedSongs()"
>

Lagu Download
(${downloads.length})

</div>

`

}

function showDownloadedSongs(){

currentPage = "downloadSongs"

const songs =
allSongs.filter(
song =>
downloads.includes(
song.url
)
)

renderSongs(songs)

}

function loadMoreSongs(){

if(
loadedSongs >=
shuffledSongs.length
)return

const nextSongs =
shuffledSongs.slice(

loadedSongs,

loadedSongs +
SONGS_PER_LOAD

)

nextSongs.forEach(
(song,index)=>{

const realIndex =
loadedSongs + index

list.innerHTML += `

<div class="music-card"
id="song-${realIndex}"
onclick="playSongByIndex(${realIndex})">

<div class="cover">
<img
src="${song.cover || '/default.png'}"
onerror="this.src='/default.png'">
</div>

<div class="info">
<h3>${song.title}</h3>
<p>${song.artist}</p>
</div>

<button
class="song-menu"
onclick="
event.stopPropagation();
showSongMenu(
'${song.url}'
)
">

⋮

</button>

</div>

`

}
)

currentList.push(
...nextSongs
)

loadedSongs +=
SONGS_PER_LOAD

}

// Player
function playSong(song){

currentSong = song
currentIndex =
currentList.findIndex(
s => s.url == song.url
)

//alert("URL: " + song.url)

audio.src = song.url
currentSongUrl = song.url

audio.play().catch(err => {
    alert("PLAY ERROR: " + err)
})

playing = true

document.getElementById("playerCover")
.classList.add("playing")

play.innerHTML = "II"

nowTitle.innerHTML =
song.title

document.getElementById(
"fullPlayer"
).style.backgroundImage =
`url('${song.cover}')`

document.getElementById(
"fullTitle"
).innerText =
song.title

document.getElementById(
"fullArtist"
).innerText =
song.artist ||
"Unknown Artist"
document.getElementById(
"playerCover"
).src =
song.cover ||
"/default.png"

document.getElementById(
"nowArtist"
).innerText =
song.artist ||
"Unknown Artist"

}

function playSongByIndex(index){

currentIndex = index

document
.querySelectorAll(".song")
.forEach(el=>{

el.classList.remove(
"playing-song"
)

})

const active =
document.querySelector(
`#song-${index} .song`
)

if(active){

active.classList.add(
"playing-song"
)

}

playSong(currentList[index])

}

window.playSongByIndex = playSongByIndex

play.onclick = () => {

    if (audio.src == "")
        return

    if (playing) {

        audio.pause()

        playing = false

        play.innerHTML = "▶"

document.getElementById("playerCover")
.classList.remove("playing")

    } else {

        audio.play()

        playing = true

        play.innerHTML = "❚❚"

document.getElementById("playerCover")
.classList.add("playing")

    }

}

audio.addEventListener(
"timeupdate",
()=>{

if(audio.duration){

progress.max =
audio.duration

progress.value =
audio.currentTime

/*const percent =
audio.currentTime /
audio.duration

const offset = circumference - (percent * circumference)

ringProgress.style.strokeDashoffset =
circumference -
(percent * circumference)*/

}

}
)

progress.addEventListener(
"input",
()=>{

audio.currentTime =
progress.value

}
)

/*next.onclick = ()=>{

if(
currentIndex <
allSongs.length-1
){

currentIndex++

const song =
allSongs[
currentIndex
]

playSong(song)

}

}

prev.onclick = ()=>{

if(
currentIndex > 0
){

currentIndex--

const song =
allSongs[
currentIndex
]

playSong(song)

}

}*/

audio.addEventListener(
"ended",
()=>{

document.getElementById("playerCover")
.classList.remove("playing")

currentIndex++

if(
currentIndex >=
currentList.length
){

currentIndex = 0

}

const song =
currentList[
currentIndex
]

playSong(song)

}
)

const addBtn =
document.getElementById(
"addBtn"
)

const playlistMenu =
document.getElementById(
"playlistMenu"
)

addBtn.onclick = ()=>{

playlistMenu.style.display =
playlistMenu.style.display ==
"block"
?
"none"
:
"block"

}

newPlaylistBtn.onclick =
async ()=>{

const nama =
prompt(
"Nama Playlist?"
)

if(!nama)return

playlists.push({

id:Date.now(),

name:nama,

songs:[]

})

await savePlaylists()
await loadAllPlaylists()

alert(
"Playlist dibuat"
)

}

async function savePlaylists(){

const user =
JSON.parse(
localStorage.getItem(
"user"
)
)

await fetch(
"/api/playlists",
{
method:"POST",
headers:{
"Content-Type":
"application/json"
},
body:JSON.stringify({

userId:user.id,

playlists

})
}
)

}

addToPlaylistBtn.onclick =
async ()=>{

if(
playlists.length == 0
){

return alert(
"Buat playlist dulu"
)

}

const nama =
prompt(

playlists
.map(
(p,i)=>
`${i+1}. ${p.name}`
)
.join("\n")

)

if(!nama)return

const index =
parseInt(nama)-1

if(
!playlists[index]
)return

playlists[index]
.songs
.push(
currentSong.url
)

await savePlaylists()

alert(
"Lagu ditambahkan"
)

}

const settingBtn =
document.getElementById(
"settingBtn"
)

const settingMenu =
document.getElementById(
"settingMenu"
)

const uploadMusic =
document.getElementById(
"uploadMusic"
)

const uploadFile =
document.getElementById(
"uploadFile"
)

settingBtn.onclick=()=>{

if(
settingMenu.style.display
==
"block"
){

settingMenu.style.display=
"none"

}else{

settingMenu.style.display=
"block"

}

}

uploadMusic.onclick=()=>{

uploadFile.click()

}

uploadFile.onchange = ()=>{

const file =
uploadFile.files[0]

if(!file)
return

const form =
new FormData()

form.append(
"music",
file
)

uploadProgress.innerText =
"0%"

const xhr =
new XMLHttpRequest()

xhr.upload.onprogress =
(e)=>{

if(
e.lengthComputable
){

const percent =
Math.round(

(e.loaded / e.total)
* 100

)

uploadProgress.innerText =
percent + "%"

}

}

xhr.onload =
()=>{

if(
xhr.status == 200
){

uploadProgress.innerText =
"100%"

alert(
"Upload berhasil"
)

uploadFile.value = ""

loadSongs()

}else{

uploadProgress.innerText =
"Gagal upload"

}

}

xhr.onerror =
()=>{

uploadProgress.innerText =
"Upload gagal"

}

xhr.open(
"POST",
"/api/upload"
)

xhr.send(form)

}

(async()=>{

await loadFavorites()

await loadFavoritePlaylists()

await loadDownloadPlaylists()

await loadPlaylists()

await loadAllPlaylists()

loadSongs()

})()

const authScreen =
document.getElementById(
"authScreen"
)

const loginBtn =
document.getElementById(
"loginBtn"
)

const registerBtn =
document.getElementById(
"registerBtn"
)

const authMsg =
document.getElementById(
"authMsg"
)

registerBtn.onclick =
async ()=>{

const username =
document.getElementById(
"username"
).value

const password =
document.getElementById(
"password"
).value

const res =
await fetch(
"/api/register",
{
method:"POST",
headers:{
"Content-Type":
"application/json"
},
body:JSON.stringify({

username,
password

})
}
)

const data =
await res.json()

authMsg.innerText =
data.message

}

loginBtn.onclick =
async ()=>{

const username =
document.getElementById(
"username"
).value

const password =
document.getElementById(
"password"
).value

const res =
await fetch(
"/api/login",
{
method:"POST",
headers:{
"Content-Type":
"application/json"
},
body:JSON.stringify({

username,
password

})
}
)

const data =
await res.json()

if(data.success){

localStorage.setItem(

"user",

JSON.stringify(
data.user
)
)
await loadFavorites()
await loadPlaylists()
await loadAllPlaylists()
await loadFavoritePlaylists()

authScreen.style.display =
"none"

}else{

authMsg.innerText =
data.message

}

}

const user =
localStorage.getItem(
"user"
)

if(user){

authScreen.style.display =
"none"

}

const logoutBtn =
document.getElementById(
"logoutBtn"
)

if(logoutBtn){

logoutBtn.onclick = ()=>{

if(
confirm(
"Keluar dari akun?"
)
){

localStorage.removeItem(
"user"
)

location.reload()

}

}

}

const musicList =
document.getElementById(
"music-list"
)

musicList.addEventListener(
"scroll",
()=>{

if(
currentPage !== "home"
)return

if(

musicList.scrollTop +
musicList.clientHeight

>=

musicList.scrollHeight
- 300

){

loadMoreSongs()

}

}
)

document
.getElementById(
"popupFavorite"
)
.onclick = ()=>{

toggleFavorite(
selectedSongUrl
)

closeSongMenu()

}

document
.getElementById(
"popupDownload"
)
.onclick = ()=>{

toggleDownload(
selectedSongUrl
)

closeSongMenu()

}

document
.getElementById(
"popupPlaylist"
)
.onclick = ()=>{

showPlaylistSelector()

}

/*alert("APP JS LOADED")
*/
