const { MongoClient } = require('mongodb');
const dev_config = (process.env.store === undefined) ? require('../config/devConfig') : undefined;
const dev_db_Url = (dev_config) ? dev_config.dev_db_Url : undefined;
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