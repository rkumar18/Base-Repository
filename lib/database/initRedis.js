

var redis = require('redis');
const { reject } = require('bluebird');

function initConnect(PORT, HOST) {
  return new Promise((resolve) => {
    let clientConnection = redis.createClient(PORT, HOST);
    clientConnection.on('connect', function () {
      logger.log({ level: 'info', context: "Redis", event: 'Redis Client Connected' });

      return resolve(clientConnection);
    });
    clientConnection.on('ready', function () {
      // logger.info('Redis instance is ready (data loaded from disk)');
    });
    clientConnection.on('error', function (e) {
      logger.error(`Error connecting to Redis: "${e.toString()}"`);
      if (e.message === 'ERR invalid password') {
        logger.error(`Fatal error occurred "${e.message}". Stopping server.`);
        reject(e);
      }
    });
  });
}

exports.initializeRedisConnection = function () {
  const PORT = config.get('databaseSettings.redis.port');
  const HOST = config.get('databaseSettings.redis.host');
  return new Promise((resolve, reject) => {
    Promise.coroutine(function* () {
      global.redis_client = yield initConnect(PORT, HOST);
    })().then(() => { resolve(true) }).catch(
      (error) => {
        logger.error(error.toString());
        reject(error);
      });
  });
}

exports.is_connected = function () {
  return !(typeof redis_client === "undefined");
}






