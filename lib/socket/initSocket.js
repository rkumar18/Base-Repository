

const socket_io = require('socket.io');

function initConnect(serverInstance) {
  return new Promise((resolve) => {

    const io = socket_io(serverInstance, { transports: ["websocket"] });
    io.on('connection', function (client) {
      logger.log({ level: 'info', context: 'SOCKET', event: "Client Connected" });
      client.on('event', function (data) {
        logger.info({ event: "Printing the EVENT of socket", msg: data });
      });

      var socketRoom;
      client.on('register_user_in_redis', (data) => {
        var userId = data.user_id;
        var accessToken = data.access_token;
        var userSocket = client.id;
        socketRoom = constants.userRedisKey + userId;
        logger.info({
          event: "Printing the user_id and socket",
          msg: {
            user_id: userId,
            socket: userSocket,
            socketid: client.id
          }
        });
        client.join(socketRoom);
      });

      client.on('register_webapp_in_redis', (data) => {
        var domainName = data.domain_name;
        var vendorId = data.vendor_id;
        var domainAndVendorId = vendorId;
        var webappSocket = client.id;
        socketRoom = constants.webappRedisKey + vendorId;
        client.join(socketRoom);
        logger.info({
          event: "Printing the webapp, vendorId and socket",
          msg: {
            domainName: domainName,
            vendorId: vendorId,
            webappSocket: webappSocket,
            domainAndVendorId: domainAndVendorId
          }
        });
        var sql = "SELECT user_id FROM tb_form_settings WHERE domain_name = ?";
        var param = [domainName];
        connection.query(sql, param, (err, result) => {
          logger.log({
            level: 'info',
            event: "Printing the query, error and result from SELECT tb_form_settings"
          });
        });
      });
      client.on('disconnect', () => {
        if (socketRoom) {
          client.leave(socketRoom);
          logger.log({
            level: 'info',
            event: " disconnect -> connection closed"
          });
        }
      });

      client.on('disconnect_user', () => {
        if (socketRoom) {
          client.leave(socketRoom);
          logger.log({
            level: 'info',
            event: " disconnect_user -> connection closed"
          });
        }
      });

      return resolve(io);
    });
  });
}

exports.initializeSocket = function (serverInstance) {
  Promise.coroutine(function* () {
    global.socket = yield initConnect(serverInstance);
  })().then(() => { }).catch(
    (error) => {
      logger.error({ context: "SOCKET", event: "Error in connection", msg: error.toString() });
      reject(error);
    });
};