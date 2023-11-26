const { MongoClient } = require('mongodb');
const dev_config = (process.env.store === undefined) ? require('../config/devConfig') : undefined;
const dev_db_Url = (dev_config) ? dev_config.dev_db_Url : undefined;
const client = new MongoClient(process.env.dbUrl || dev_db_Url);
const collection = client.db("Posdar").collection("users");

async function readOne(userName = {}) {
    await client.connect();
    let user = await collection.findOne({ "user_name": userName });
    client.close();
    return user;
};
readOne("Bass.sites.dev@gmail$$$.com")

module.exports = { readOne };