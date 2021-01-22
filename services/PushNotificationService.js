
const config = require('config');
const mongoose = require("mongoose");
const FCM = require('fcm-node');
const Models = require('../models/index');
const constant = require("../lib/constants/constants");

exports.sendAndroidPushNotifiction=sendAndroidPushNotifiction;
exports.sendIosPushNotification=sendIosPushNotification;
exports.preparePushNotifiction=preparePushNotifiction;
exports.sendWebPushNotifiction=sendWebPushNotifiction;
exports.sendPushNotifictionAccordingToDevice=sendPushNotifictionAccordingToDevice;

async function sendAndroidPushNotifiction(payload){
    let fcm = new FCM(config.get("fcmKey.android"));
    var message = {
        to: payload.deviceToken || '',
        collapse_key:'ENTREEGO',
        data:payload
    };
    if(payload.isDriverNotification && payload.isNotificationSave){
      new Models.DriverNotificationModel(payload).save();
    }
    if(payload.isResturantNotification && payload.isNotificationSave){
      new Models.ResturantNotificationModel(payload).save();
    }
    if(payload.isAdminNotification && payload.isNotificationSave){
      new Models.AdminNotificationModel(payload).save();
    }
    fcm.send(message, (err, response) => {
        if (err) {
            console.log('Something has gone wrong!',err);
        } else {
            console.log('Push successfully sent!');
        }
    });
}
async function sendIosPushNotification(payload) {
  
  let fcm = new FCM(config.get("fcmKey.ios"));
  var message = {
      to: payload.deviceToken || '',
      collapse_key:'ENTREEGO',
      notification: {
        title: payload.title || '',
        body: payload.message || '',
        sound:'default'
      },
      data:payload || {}
  };
  
  if(payload.isDriverNotification && payload.isNotificationSave){
    new Models.DriverNotificationModel(payload).save();
  }
  if(payload.isResturantNotification && payload.isNotificationSave){
    new Models.ResturantNotificationModel(payload).save();
  }
  if(payload.isAdminNotification && payload.isNotificationSave){
    new Models.AdminNotificationModel(payload).save();
  }
  fcm.send(message, (err, response) => {
      if (err) {
    console.log('Something has gone wrong! IOS',err);
      } else {
         console.log('Push successfully sent! IOS');
      }
  });
}
async function sendWebPushNotifiction(payload){

  let fcm = new FCM(config.get("fcmKeyUser.android"));
  var message = {
      to: payload.deviceToken || '',
      collapse_key:'ENTREEGO',
      data:payload,
      notification: {
        title: payload.title || '',
        body: payload.message || ''
    }
  };
  
  if(payload.isDriverNotification && payload.isNotificationSave){
    new Models.DriverNotificationModel(payload).save();
  }
  if(payload.isResturantNotification && payload.isNotificationSave){
    new Models.ResturantNotificationModel(payload).save();
  }
  if(payload.isAdminNotification && payload.isNotificationSave){
    new Models.AdminNotificationModel(payload).save();
  }
  fcm.send(message, (err, response) => {
      if (err) {
     console.log('Something has gone wrong!',err);
      } else {
         console.log('Push successfully sent!');
      }
  });
}
async function saveNotifiction(payload){
  if(payload.isDriverNotification && payload.isNotificationSave){
    new Models.DriverNotificationModel(payload).save();
  }
  if(payload.isResturantNotification && payload.isNotificationSave){
    new Models.ResturantNotificationModel(payload).save();
  }
  if(payload.isAdminNotification && payload.isNotificationSave){
    new Models.AdminNotificationModel(payload).save();
  }
}
async function sendPushNotifictionAccordingToDevice(deviceData, payload){
  let deviceToken = deviceData.deviceToken;
  let deviceType = deviceData.deviceType;
  payload.deviceToken = deviceToken;
  switch(deviceType) {
    case constant.DEVICE_TYPE.ANDROID:
      sendAndroidPushNotifiction(payload);
      break;
    case constant.DEVICE_TYPE.IOS:
      sendIosPushNotification(payload);
      break;
    case constant.DEVICE_TYPE.WEB:
      sendWebPushNotifiction(payload);
      break;
    default:
      console.log('Invalid device type');
      break;
  }
  return true;
}
async function preparePushNotifiction(payloadData, userType){
  let payload=JSON.parse(JSON.stringify(payloadData));
  if(payload && payload.data)
  delete payload.data;
  if(payload && payload.keys)
  delete payload.keys;
  if (userType == constant.PUSHROLE.DRIVER) {
    const deviceData = await Models.DeviceModel.findOne({
      driverId:payload.driverId._id
    })
    if (deviceData) {
      sendPushNotifictionAccordingToDevice(deviceData, payload);
    } else {
      console.log('No driver device data found.')
    }
  } else if (userType == constant.PUSHROLE.RESTURANT) {
    const deviceData = await Models.DeviceModel.findOne({
      resturantId:payload.resturantId
    })
    if (deviceData) {
      sendPushNotifictionAccordingToDevice(deviceData, payload);
    } else {
      console.log('No driver device data found.')
    }
  }else if (userType ==constant.PUSHROLE.ADMIN) {
    saveNotifiction(payload)
  }
}
