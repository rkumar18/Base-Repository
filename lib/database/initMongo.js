"use strict";

const MongoClient = require('mongodb').MongoClient;

function initConnect(mongoConnectionURL, mongoOptions) {
  return new Promise((resolve, reject) => {
    MongoClient.connect(mongoConnectionURL, mongoOptions, function (err, client) {
      if (err) {
        logger.error({ context: 'MongoDB', event: 'Error connecting MongoDB!!', msg: { mongoConnectionURL, mongoOptions } });
        return reject(err);
      } else {
        logger.log({ level: 'info', context: 'MongoDB', event: 'Connection established with MongoDB' });
        return resolve(client.db());
      }
    });
  });
}


exports.initializeMongoConnection = function () {

  const MONGO_OPTIONS = {
    poolSize: 20,
    useNewUrlParser: true,
    useUnifiedTopology: true
  };

  const MONGO_USER = process.env.MONGO_USER || config.get("databaseSettings.mongoDb.user") || '';
  const MONGO_PASSWORD = process.env.MONGO_PASS || config.get("databaseSettings.mongoDb.password") || '';
  const MONGO_HOST = process.env.MONGO_HOST || config.get("databaseSettings.mongoDb.host") || 'localhost';
  const MONGO_PORT = process.env.MONGO_PORT || config.get("databaseSettings.mongoDb.port") || '27017';
  const MONGO_DATABASE = process.env.MONGO_DATABASE || config.get("databaseSettings.mongoDb.database") || '';

  const MONGO_CONNECTION_URL = "mongodb://" + (MONGO_USER && MONGO_PASSWORD ? (MONGO_USER + ":" + MONGO_PASSWORD + "@") : '') + MONGO_HOST + ":" + MONGO_PORT + "/" + MONGO_DATABASE;

  return new Promise((resolve, reject) => {
    Promise.coroutine(function* () {
      global.database = yield initConnect(MONGO_CONNECTION_URL, MONGO_OPTIONS);
    })()
      .then(() => { resolve(true) })
      .catch((error) => {
        logger.error({ context: "MongoDB", event: "Error in connection", msg: error.toString() });
        reject(error);
      });
  });
}

