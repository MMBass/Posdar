const { MongoClient } = require('mongodb');

let dev_db_Url;
let privateConfig;
if (process.env.store !== 'heroku') {
    try {
        privateConfig = require('../config/privateConfig');
        dev_db_Url = privateConfig.dev_db_Url;
    } catch {
        console.log("privateConfig doesnt exist");
    }
}
const client = new MongoClient(process.env.dbUrl || dev_db_Url);
const collection = client.db("Posdar").collection("tasks");

async function readAll() {
    await client.connect();
    let all = await collection.find({}).toArray();
    client.close();
    return all;
};

async function createOne(details) {
    await client.connect();
    await collection.insertOne(details);
    client.close();
    return true;
};

async function putOne(id,newvalues = {}) {
    console.log(id,newvalues );
    await client.connect();
    await collection.updateOne({_id:id},{ $set: newvalues })
    client.close();
    return true;
};

async function removeOne() {
    // await client.connect();
    // await collection.find({}).toArray();
    // client.close();
    // return true;
};

module.exports = {readAll,createOne,putOne, removeOne};