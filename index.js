const bcrypt =
require("bcryptjs")
const mm = require("music-metadata")
const multer = require("multer")
const path = require("path")
const express = require("express")
const {
db,
initDB
} = require("./database")

const fs = require("fs")
const cors = require("cors")

const app = express()
app.use(express.json())

const storage = multer.diskStorage({

destination:function(req,file,cb){

cb(null,"songs/")

},

filename:function(req,file,cb){

let nama =
file.originalname
.replace(/\s+/g,"_")

let ext =
path.extname(nama)

let base =
path.basename(nama,ext)

let hasil = nama

let nomor = 2

while(

fs.existsSync(
path.join(
"songs",
hasil
)
)

){

hasil =
base +
"-" +
nomor +
ext

nomor++

}

cb(
null,
hasil
)

}

})

const upload =
multer({

storage

})

const PORT = 3000

app.post(
"/api/register",
async(req,res)=>{

const {
username,
password
} = req.body

if(
!username ||
!password
){

return res.json({

success:false,

message:
"Username dan password wajib diisi"

})

}

await db.read()

const user =
db.data.users.find(
u =>
u.username === username
)

if(user){

return res.json({
success:false,
message:
"Username sudah ada"
})

}

const hash =
await bcrypt.hash(
password,
10
)

db.data.users.push({

id:Date.now(),

username,

password:hash,

favorites:[],

favoritPlaylists:[],

downloadPlaylists: [],

playlists:[]

})

await db.write()

res.json({

success:true,

message:
"Register berhasil"

})

}
)

app.post(
"/api/login",
async(req,res)=>{

const {
username,
password
} = req.body

await db.read()

const user =
db.data.users.find(
u =>
u.username === username
)

if(!user){

return res.json({

success:false,

message:
"User tidak ditemukan"

})

}

const valid =
await bcrypt.compare(
password,
user.password
)

if(!valid){

return res.json({

success:false,

message:
"Password salah"

})

}

res.json({

success:true,

user:{

id:user.id,

username:user.username

}

})

}
)

app.get(
"/api/playlists/:id",
async(req,res)=>{

await db.read()

const user =
db.data.users.find(
u =>
u.id ==
req.params.id
)

if(!user){

return res.json([])
}

res.json(
user.playlists || []
)

}
)

app.get(
"/api/all-playlists",
async(req,res)=>{

await db.read()

let data=[]

db.data.users.forEach(
user=>{

if(user.playlists){

user.playlists.forEach(
p=>{

data.push({

id:p.id,

name:p.name,

songs:p.songs,

owner:user.username

})

}

)

}

}

)

res.json(data)

}
)

app.post(
"/api/playlists",
async(req,res)=>{

const {
userId,
playlists
} = req.body

await db.read()

const user =
db.data.users.find(
u =>
u.id == userId
)

if(!user){

return res.json({
success:false
})

}

user.playlists =
playlists

await db.write()

res.json({
success:true
})

}
)

app.get(
"/api/favorites/:id",
async(req,res)=>{

await db.read()

const user =
db.data.users.find(
u =>
u.id ==
req.params.id
)

if(!user){

return res.json([])
}

res.json(
user.favorites || []
)

}
)

app.post(
"/api/favorites",
async(req,res)=>{

const {
userId,
favorites
} = req.body

await db.read()

const user =
db.data.users.find(
u =>
u.id == userId
)

if(!user){

return res.json({
success:false
})

}

user.favorites =
favorites

await db.write()

res.json({
success:true
})

}
)

app.get(
"/api/favorite-playlists/:id",
async(req,res)=>{

await db.read()

const user =
db.data.users.find(
u=>u.id==req.params.id
)

if(!user){

return res.json([])

}

res.json(
user.favoritePlaylists || []
)

}
)

app.get(
"/api/favorite-playlists/:id",
async(req,res)=>{

await db.read()

const user =
db.data.users.find(
u=>u.id==req.params.id
)

if(!user){

return res.json([])

}

res.json(
user.favoritePlaylists || []
)

}
)

app.post(
"/api/favorite-playlists",
async(req,res)=>{

const {

userId,
favoritePlaylists

} = req.body

await db.read()

const user =
db.data.users.find(
u=>u.id==userId
)

if(!user){

return res.json({
success:false
})

}

user.favoritePlaylists =
favoritePlaylists

await db.write()

res.json({
success:true
})

}
)

app.get(
"/api/download-playlists/:id",
async(req,res)=>{

await db.read()

const user =
db.data.users.find(
u=>u.id==req.params.id
)

if(!user){

return res.json([])

}

res.json(
user.downloadPlaylists || []
)

}
)

app.post(
"/api/download-playlists",
async(req,res)=>{

const {

userId,
downloadPlaylists

} = req.body

await db.read()

const user =
db.data.users.find(
u=>u.id==userId
)

if(!user){

return res.json({
success:false
})

}

user.downloadPlaylists =
downloadPlaylists

await db.write()

res.json({
success:true
})

}
)

app.use(cors())

app.use(express.static(path.join(__dirname, "public")))

app.use(
    "/songs",
    express.static(
        path.join(__dirname, "songs")
    )
)

app.use(
    "/covers",
    express.static(
        path.join(__dirname, "covers")
    )
)

function getHost(req) {
    return `${req.protocol}://${req.get("host")}`
}

app.get("/api/songs", async (req, res) => {
    const host = getHost(req)

    const files = fs.readdirSync("./songs")
        .filter(f => f.endsWith(".mp3"))

    const data = await Promise.all(
        files.map(async (file, i) => {

            let cover = null
            let title = path.parse(file).name
            let artist = "Unknown Artist"

            try {
                const meta = await mm.parseFile(
                    path.join(__dirname, "songs", file)
                )

                if (meta?.common?.title) {
                    title = meta.common.title
                }

                if (meta?.common?.artist) {
                    artist = meta.common.artist
                }

                const pic = meta?.common?.picture

                if (Array.isArray(pic) && pic.length > 0) {
                const img = pic[0]

                if (img?.data) {
                const buffer = Buffer.from(img.data)

                cover = `data:${img.format};base64,${buffer.toString("base64")}`
}
}

            } catch (e) {
                console.log("meta error:", file)
            }

            return {
                id: i + 1,
                title,
                artist,
                url: host + "/songs/" + encodeURIComponent(file),
                cover
            }
        })
    )

    res.json(data)
})

app.get("/", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "public",
            "index.html"
        )

    )

})

app.post(
"/api/upload",
upload.single(
"music"
),
(req,res)=>{

res.json({

status:true,
message:
"Upload berhasil"

})

}
)

initDB()
app.listen(PORT, () => {

    console.log("")
    console.log("================================")
    console.log(" Musicdy Blue Server Aktif ")
    console.log("================================")
    console.log("Port :", PORT)
    console.log("")

})
