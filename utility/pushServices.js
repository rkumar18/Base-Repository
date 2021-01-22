var Promise                                                 = require('bluebird');
var FCM                                                     = require('fcm-node');
var apns                                                    = require('apn');


var logging                                                 = require('../logging/logging');
var userServices                                            = require('../user/services/userServices');
var commonConfig                                            = require('../config/common_config');


exports.sendPushNotification                                = sendPushNotification;

function sendPushNotification(apiContext ,userIds ,payload ,message){
    console.log("SEND PUSH NOTIFICATION",apiContext ,userIds ,payload ,message);

    Promise.coroutine(function *(){
        var userSessions = yield userServices.getSession(apiContext, {user_id_in: userIds, expiry_at: 1, is_active: 1, device_type_nn: 1});
        if(!Array.isArray(userSessions)
            && !userSessions.length
            && !userSessions[0].device_token
            && !userSessions[0].device_type){
            return;
        }
        var tokens = {};
        userSessions.forEach(function(token){
            tokens[token.device_type]? tokens[token.device_type].push(token.device_token) : tokens[token.device_type] = [token.device_token]
        });
        console.log("TOKENS>>>>", tokens);

        sendNotificationToDevice(apiContext, 'ping.caf', commonConfig.deviceTypes.ANDROID, tokens[commonConfig.deviceTypes.ANDROID] || [], message, payload);
        sendNotificationToDevice(apiContext, 'ping.caf', commonConfig.deviceTypes.IOS, tokens[commonConfig.deviceTypes.IOS] || [], message, payload);
    })().then((data) =>{
    }).catch((error) =>{
        console.log(error);
    });
}

function sendNotificationToDevice(apiContext, tone, deviceType, deviceToken, message, payload) {
    console.log("SEND PUSH NOTIFICATION",apiContext, tone, deviceType, deviceToken, message, payload);
    if(!deviceToken || !deviceToken.length){
        return;
    }
    var stringifiedPayload = "";
    try {
        stringifiedPayload = JSON.stringify(payload);
    } catch (e) {}

    if ((stringifiedPayload.length || 0) / 1024 > 2
        && payload.jobs && payload.jobs[0]) {
        payload.incomplete_data = true;
        delete payload.jobs;
    }


    if(deviceType  === commonConfig.deviceTypes.ANDROID ){
        sendAndroidPushNotification(apiContext, deviceToken, payload);
    }
    else{
        sendIosPushNotification(apiContext, tone, deviceToken, message, payload)
    }
}

function sendAndroidPushNotification(apiContext, deviceToken, payload){

        var fcm = new FCM(config.get('pushNotifications.fcmKey'));


    deviceToken.forEach(function(device_token){
        var message = {
            to: device_token,
            data: payload
        };
        fcm.send(message,function(error,response){
            if(error){
                logging.consolelog("Something has gone wrong!", error, response);
            }
            else{
                logging.consolelog("Successfully sent with response: ", response);
            }
        });
    })

}

function sendIosPushNotification(apiContext, tone, deviceToken, message, payload){

        var status = 1;
        var msg = message;
        var snd = tone;
        var options = {
            cert: config.get('pushNotifications.iosPemPath'),
            key: config.get('pushNotifications.iosPemPath'),
            keyData: null,
            passphrase: 'clickpass',
            ca: null,
            pfx: null,
            pfxData: null,
            gateway: config.get('pushNotifications.apnsGateway'),
            port: 2195,
            rejectUnauthorized: true,
            enhanced: true,
            cacheLength: 100,
            autoAdjustCache: true,
            connectionTimeout: 0,
            ssl: true
        };

        console.log("BEFORE APNS CONNECT", options);
        var apnsConnection = new apns.Connection(options);
        var note = new apns.Notification();


    note.expiry = Math.floor(Date.now() / 1000) + 3600;
        note.sound = snd;
        note.alert = msg;
        note.newsstandAvailable = status;
        note.payload = payload;
        note.badge = 1;
    console.log("AFTER APNS CONNECT", note);

        apnsConnection.pushNotification(note, deviceToken);
    console.log("SENT APNS NOTI", note);

        function log(type) {
            return function () {
                console.log("APNS EVENT",type);
                // if (debugging_enabled)
                // if (type === 'transmitted') {
                // }
                // if (type === 'transmissionError' || type === 'socketError' || type === 'timeout' || type === 'error')

            }
        }

        apnsConnection.on('transmissionError', function (err, n, c) {

        });
        apnsConnection.on('error', log('error'));
        apnsConnection.on('transmitted', log('transmitted'));
        apnsConnection.on('timeout', log('timeout'));
        apnsConnection.on('connected', log('connected'));
        apnsConnection.on('disconnected', log('disconnected'));
        apnsConnection.on('socketError', log('socketError'));
        apnsConnection.on('transmissionError', log('transmissionError'));
        apnsConnection.on('cacheTooSmall', log('cacheTooSmall'));
}