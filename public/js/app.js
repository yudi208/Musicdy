//alert("APP VERSION 2026-06-24-2")

window.onerror = function(msg, url, line, col, err){

    alert(
        "ERROR:\n\n" +
        msg +
        "\n\nLine: " + line
    )

}
const API =
"https://musicdy.208.biz.id"

const Filesystem =
window.Capacitor?.Plugins?.Filesystem

console.log(
    "Filesystem =",
    Filesystem
)

setTimeout(()=>{

alert(
JSON.stringify(
window.Capacitor.PluginHeaders
.filter(
p => p.name === "MediaSession"
),
null,
2
)
)

},3000)

setTimeout(() => {
    console.log("Plugins =", window.Capacitor?.Plugins)
}, 2000)

console.log("Capacitor:", window.Capacitor)

const playFull = document.getElementById("playFull")
const nextFull = document.getElementById("nextFull")
const prevFull = document.getElementById("prevFull")
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
const radius = 46
const circumference = 2 * Math.PI * radius
const uploadProgress = document.getElementById("uploadProgress")
const nowTitle = document.getElementById("nowTitle")
const menuFavorite = document.getElementById("menuFavorite")
const search = document.getElementById("search")
const fullProgress =
document.getElementById("fullProgress")

const currentTimeText =
document.getElementById("currentTime")

const durationText =
document.getElementById("duration")

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

playFull.onclick = () => {
    play.click()
}

nextFull.onclick = () => {

    currentIndex++

    if(currentIndex >= currentList.length){
        currentIndex = 0
    }

    playSongByIndex(currentIndex)

}

prevFull.onclick = () => {

    currentIndex--

    if(currentIndex < 0){
        currentIndex = currentList.length - 1
    }

    playSongByIndex(currentIndex)

}

let selectedPlaylistId = null
let selectedSongUrl = null
let selectedSong = null
let audio = new Audio()
let playing = false
let playMode = "repeat-all"
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

let downloadedSongs =
JSON.parse(
localStorage.getItem(
"downloadedSongs"
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

const zoomBtn =
document.getElementById(
    "zoomBtn"
)

const zoomPanel =
document.getElementById(
    "zoomPanel"
)

const zoomSlider =
document.getElementById(
    "zoomSlider"
)

const zoomValue =
document.getElementById(
    "zoomValue"
)

let uiScale =
parseFloat(
localStorage.getItem(
    "uiScale"
)
) || 1

document.body.style.zoom =
uiScale

zoomSlider.value =
uiScale * 100

zoomValue.innerHTML =
Math.round(
uiScale * 100
) + "%"

zoomBtn.onclick = ()=>{

    zoomPanel.style.display =
    zoomPanel.style.display ==
    "block"
    ? "none"
    : "block"

}

zoomSlider.oninput = ()=>{

    uiScale =
    zoomSlider.value / 100

    document.body.style.zoom =
    uiScale

    zoomValue.innerHTML =
    zoomSlider.value + "%"

    localStorage.setItem(
        "uiScale",
        uiScale
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

function updatePlayModeUI(){

    let icon = "↻"

    if(playMode === "shuffle"){
        icon = "⇄"
    }

    if(playMode === "repeat-one"){
        icon = "↻¹"
    }

    document.getElementById(
        "playMode"
    ).innerHTML = icon

    document.getElementById(
        "playModeFull"
    ).innerHTML = icon

}

function changePlayMode(){

    if(playMode === "repeat-all"){

        playMode = "shuffle"

    }

    else if(playMode === "shuffle"){

        playMode = "repeat-one"

    }

    else{

        playMode = "repeat-all"

    }

    updatePlayModeUI()

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

try{

    const res =
    await fetch(
        `${API}/api/all-playlists`
    )

    allPlaylists =
    await res.json()

    localStorage.setItem(
        "allPlaylists",
        JSON.stringify(
            allPlaylists
        )
    )

}catch(err){

    const cache =
    JSON.parse(
        localStorage.getItem(
            "allPlaylists"
        )
    ) || []

    allPlaylists =
    cache

}

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
`${API}/api/playlists/${user.id}`
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
`${API}/api/favorites/${user.id}`
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
`${API}/api/favorite-playlists/${user.id}`
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

try{

    const res =
    await fetch(
        `${API}/api/download-playlists/${user.id}`
    )

    downloadPlaylists =
    await res.json()

    localStorage.setItem(
        "downloadPlaylists",
        JSON.stringify(
            downloadPlaylists
        )
    )

}catch(err){

    downloadPlaylists =
    JSON.parse(
        localStorage.getItem(
            "downloadPlaylists"
        )
    ) || []

}

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
`${API}/api/favorite-playlists`,
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
`${API}/api/download-playlists`,
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

let nomor = 0

for(
const url
of playlist.songs
){

    nomor++

    document.title =
    "Playlist " +
    nomor +
    "/" +
    playlist.songs.length

    if(
    !downloads.includes(url)
    ){

        await downloadSongFile(
            url
        )

    }

}

downloadPlaylists.push(id)

await saveDownloadPlaylists()

alert(
"Playlist selesai diunduh"
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

await loadAllPlaylists()
await savePlaylists()
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

    try{

        const response =
        await fetch(
            `${API}/api/songs`
        )

        allSongs =
        await response.json()

        localStorage.setItem(
            "allSongs",
            JSON.stringify(allSongs)
        )

    }catch(err){

        alert(
            "Mode Offline"
        )

        allSongs =
        JSON.parse(
            localStorage.getItem(
                "allSongs"
            )
        ) || []

    }

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

Back

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

Back

</div>

`

const downloadLists =
allPlaylists.filter(
playlist =>
downloadPlaylists.some(
id =>
String(id) ===
String(playlist.id)
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

const sourceSongs =

allSongs.length > 0
? allSongs
: downloadedSongs

const songs =
sourceSongs.filter(
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

return (
playlistName ===
songName
)

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
`${API}/api/favorites`,
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

downloadSongFile(url)

}

localStorage.setItem(
"downloads",
JSON.stringify(
downloads
)

)

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
`${API}/api/playlists`,
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

await loadAllPlaylists()
await loadPlaylists()

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

function formatTime(seconds){

    const min =
    Math.floor(seconds / 60)

    const sec =
    Math.floor(seconds % 60)

    return min + ":" +
    String(sec).padStart(2,"0")

}

fullProgress.addEventListener(
"input",
()=>{

    audio.currentTime =
    fullProgress.value

})

function showDownloadedSongs(){

currentPage = "downloadSongs"

renderSongs(
    downloadedSongs
)

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

async function getLocalFile(url){

    try{

        const filename =
        url.split("/").pop()

        const files =
        await Filesystem.readdir({
            path:"",
            directory:"DATA"
        })

        const found =
        files.files.find(
            f => f.name === filename
        )

        if(found){

            return found.uri

        }

    }catch(err){

        console.log(err)

    }

    return null

}

// Player
async function playSong(song){

currentSong = song
currentIndex =
currentList.findIndex(
s => s.url == song.url
)

fullProgress.value = 0

currentTimeText.textContent =
"0:00"

durationText.textContent =
"0:00"

//alert("URL: " + song.url)
//console.log("SONG =", song)
//console.log("URL =", song.url)

let source = song.url

const offlineFile =
await getLocalFile(song.url)

/*alert(
    "OFFLINE FILE:\n" +
    offlineFile
)*/

if(offlineFile){

    source =
    window.Capacitor.convertFileSrc(
        offlineFile
    )

}

audio.src = source
currentSongUrl = source

/*alert(
    "SOURCE:\n" +
    source
)*/

audio.play().catch(err => {

if(
window.Capacitor?.Plugins?.MediaSession
){

alert("MediaSession APK ADA")

}
    alert(
        "PLAY ERROR:\n" +
        err
    )

    console.log(err)

})

if ("mediaSession" in navigator) {

    navigator.mediaSession.metadata =
        new MediaMetadata({
            title: song.title,
            artist: song.artist || "Unknown Artist",
            artwork: [{
    src: song.cover || "/icon/logo.png",
    sizes: "512x512",
    type: "image/png"

            }]
        });

    navigator.mediaSession.setActionHandler(
        "play",
        () => audio.play()
    );

    navigator.mediaSession.setActionHandler(
        "pause",
        () => audio.pause()
    );

    navigator.mediaSession.setActionHandler(
        "nexttrack",
        () => {
            playSongByIndex(
                currentIndex >= currentList.length - 1
                ? 0
                : currentIndex + 1
            );
        }
    );

    navigator.mediaSession.setActionHandler(
        "previoustrack",
        () => {
            playSongByIndex(
                currentIndex <= 0
                ? currentList.length - 1
                : currentIndex - 1
            );
        }
    );
}

if(
window.Capacitor?.Plugins?.MediaSession
){

await window.Capacitor
.Plugins
.MediaSession
.setMetadata({

title:
song.title,

artist:
song.artist || "Unknown Artist",

album:
"Musicdy",

artworkUrl:
song.cover || ""

})

await window.Capacitor
.Plugins
.MediaSession
.setPlaybackState({

playbackState:
"playing"

})

}

playing = true

document.getElementById("playerCover")
.classList.add("playing")

play.innerHTML = "❚❚"
playFull.innerHTML = "❚❚"

nowTitle.innerHTML =
song.title

const fullPlayer =
document.getElementById("fullPlayer")

if(song.cover){

    fullPlayer.style.backgroundImage =
    `url('${song.cover}')`

}else{

    fullPlayer.style.backgroundImage =
    "url('/default.png')"

}

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
        playFull.innerHTML = "▶"

document.getElementById("playerCover")
.classList.remove("playing")

    } else {

        audio.play()

        playing = true

        play.innerHTML = "❚❚"
        playFull.innerHTML = "❚❚"

document.getElementById("playerCover")
.classList.add("playing")

    }

}

audio.addEventListener(
"timeupdate",
()=>{

audio.addEventListener("timeupdate", () => {

    if (!isNaN(audio.duration)) {

        fullProgress.max =
        audio.duration

        fullProgress.value =
        audio.currentTime

        currentTimeText.textContent =
        formatTime(audio.currentTime)

        durationText.textContent =
        formatTime(audio.duration)

    }

})

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

    if(
        playMode ===
        "repeat-one"
    ){

        playSongByIndex(
            currentIndex
        )

        return

    }

    if(
        playMode ===
        "shuffle"
    ){

        const randomIndex =
        Math.floor(
            Math.random() *
            currentList.length
        )

        playSongByIndex(
            randomIndex
        )

        return

    }

    currentIndex++

    if(
        currentIndex >=
        currentList.length
    ){

        currentIndex = 0

    }

    playSongByIndex(
        currentIndex
    )

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

await loadAllPlaylists()
await savePlaylists()

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
`${API}/api/playlists`,
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
`${API}/api/upload`
)

xhr.send(form)

}

(async()=>{

await loadAllPlaylists()

await loadFavorites()

await loadFavoritePlaylists()

await loadDownloadPlaylists()

await loadPlaylists()

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
`${API}/api/register`,
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

//alert("2")

//alert("API = " + API)

/*fetch("https://musicdy.208.biz.id")
.then(() => alert("DOMAIN OK"))
.catch(err => alert("DOMAIN ERROR:\n" + err))*/

let data

try{

const res =
await fetch(
`${API}/api/login`,
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

data =
await res.json()

}catch(err){

alert(
"FETCH ERROR:\n" +
err
)

return

}

if(data.success){

localStorage.setItem(
"user",
JSON.stringify(
data.user
)
)
await loadAllPlaylists()
await loadFavorites()
await loadPlaylists()
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

document.getElementById(
    "playMode"
).onclick =
changePlayMode

document.getElementById(
    "playModeFull"
).onclick =
changePlayMode

updatePlayModeUI()

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

async function downloadSongFile(url){

    try{

        alert("Sedang mengunduh...")

        const response =
        await fetch(url)

        const blob =
        await response.blob()

        const reader =
        new FileReader()

        reader.readAsDataURL(blob)

        reader.onloadend =
        async ()=>{
            const base64 =
            reader.result.split(",")[1]

            const filename =
            url.split("/").pop()

try{

    await Filesystem.writeFile({

        path:
        filename,

        data:
        base64,

        directory:
        "DATA"

    })


}catch(err){

    console.log(err)

    return

}

if(
!downloads.includes(url)
){

downloads.push(url)

localStorage.setItem(
"downloads",
JSON.stringify(
downloads
)
)

const song =
allSongs.find(
s => s.url === url
)

if(song){

    downloadedSongs.push(song)

    localStorage.setItem(
        "downloadedSongs",
        JSON.stringify(
            downloadedSongs
        )
    )

}

if(
currentPage ===
"downloadSongs"
){

showDownloadedSongs()

}
}

            alert(
            "Download selesai:\n" +
            filename
            )

return true

        }

    }catch(err){

        alert(
        "Download gagal:\n" +
        err
        )

return false

    }

}

async function cekFileDownload(){

    try{

        const files =
        await Filesystem.readdir({

            path: "",
            directory: "DATA"

        })

        alert(
            JSON.stringify(
                files.files,
                null,
                2
            )
        )

    }catch(err){

        alert(
            "ERROR:\n" + err
        )

    }

}

/*alert("APP JS LOADED")
*/
