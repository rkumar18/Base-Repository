const Resturant = require("./ResturantSockets");
const admin = require("./adminSockets");
const driver = require("./DriverSockets");
const io = require("socket.io");
const constant = require('../constants/constants');
const universalFunction = require("../../services/jwtServices");
const pushNotificationService = require('../../services/PushNotificationService')

module.exports = io => {
  io.on("connection", socket => {
    console.log("connected to sockets");
    Resturant(io, socket);
    admin(io, socket);
    driver(io, socket);
    socket.on("disconnect", function() {
      console.log("Disconnect",socket.id);
    });
  });
  process.on("blockUser", function(data) {
    if (data && data.userId) io.to(data.userId).emit("blockUser", data);
  });
  process.on("sendNotificationToResturant", async function(payloadData) {
    try {
      if (payloadData && payloadData.restaurantId) {
          payloadData.pushType = payloadData.pushType ? payloadData.pushType : 0;
          let lang = payloadData.lang || "en";
          let values = payloadData.values ? payloadData.values : {};
          let inputKeysObj = constant.PUSH_TYPE[payloadData.pushType];
          let eventType = payloadData.eventType || null;
          let data = await universalFunction.renderTemplateField(
            inputKeysObj,
            values,
            lang,
            eventType,
            payloadData
          );
         io.to(payloadData.resturantId).emit('sendNotificationToResturant', data);
         pushNotificationService.preparePushNotifiction(data, constant.PUSHROLE.RESTURANT);
      }
    } catch(err) {
      console.log(err)
    }
  });
  process.on("sendNotificationToAdmin", async function(payloadData) {
    try {
    if (payloadData && payloadData.adminId) {
        payloadData.pushType = payloadData.pushType ? payloadData.pushType : 0;
        let lang = payloadData.lang || "en";
        let values = payloadData.values ? payloadData.values : {};
        let inputKeysObj = constant.PUSH_TYPE[payloadData.pushType];
        let eventType = payloadData.eventType || null;
        let data = await universalFunction.renderTemplateField(
          inputKeysObj,
          values,
          lang,
          eventType,
          payloadData
        );
        io.to(payloadData.adminId).emit('sendNotificationToAdmin', data);
        pushNotificationService.preparePushNotifiction(data, constant.PUSHROLE.ADMIN);
    }
  } catch(err) {
    console.log(err)
  }
  });
  process.on("sendNotificationToDriver", async function(payloadData) {
    try {
    if (payloadData && payloadData.driverId) {
        payloadData.pushType = payloadData.pushType ? payloadData.pushType : 0;
        let lang = payloadData.lang || "en";
        let values = payloadData.values ? payloadData.values : {};
        let inputKeysObj = constant.PUSH_TYPE[payloadData.pushType] || null;
        let eventType = payloadData.eventType || null;
        let data = await universalFunction.renderTemplateField(
          inputKeysObj,
          values,
          lang,
          eventType,
          payloadData
        );
        io.to(payloadData.driverId._id).emit('sendNotificationToDriver', data);
        pushNotificationService.preparePushNotifiction(data, constant.PUSHROLE.DRIVER);
    }
  } catch(err) {
    console.log(err)
  }
  });
};
