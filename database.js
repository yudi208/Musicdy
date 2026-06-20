const { JSONFile } = require("lowdb/node")
const { Low } = require("lowdb")

const adapter = new JSONFile(
"./database.json"
)

const defaultData = {

users:[]

}

const db = new Low(
adapter,
defaultData
)

async function initDB(){

await db.read()

db.data ||= defaultData

await db.write()

}

module.exports = {

db,
initDB

}
