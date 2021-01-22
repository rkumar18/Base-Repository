var jwt = require('jsonwebtoken');
const Handlebars = require("handlebars");

var issue = payload => {
    return jwt.sign(payload, config.get('JWT_SERVICE.jwt_secret'), {expiresIn: 3600000});
};
var verify = (token, cb) => {
    return jwt.verify(token, config.get('JWT_SERVICE.jwt_secret'), {}, cb);
};
async function setPrecision(no,precision){
    precision=precision || 2;
    if(!isNaN(no)){
    return parseFloat((no).toFixed(precision))
    }else{
      return 0;
    }
}
async function renderTemplateField(inputKeysObj, values, lang, eventType = null,payloadData) {
    lang = lang || "en";
    let sendObj = {};
    sendObj.driverId=payloadData.driverId?payloadData.driverId :null;
    sendObj.restaurantId=payloadData.restaurantId?payloadData.restaurantId:null;
    sendObj.adminId=payloadData.adminId?payloadData.adminId:null;
    sendObj.rasturantImage=payloadData.rasturantImage?payloadData.rasturantImage:null;
    sendObj.isBusy=payloadData.isBusy?payloadData.isBusy:false;
    sendObj.isResturantNotification=payloadData.isResturantNotification?payloadData.isResturantNotification:false;
    sendObj.isDriverNotification=payloadData.isDriverNotification?payloadData.isDriverNotification:false;
    sendObj.isAdminNotification=payloadData.isAdminNotification?payloadData.isAdminNotification:false;
    sendObj.isNotificationSave=payloadData.isNotificationSave?payloadData.isNotificationSave:false;
    sendObj.pushType=payloadData.pushType?payloadData.pushType:0;
    sendObj.eventType=payloadData.eventType?payloadData.eventType:null;
    sendObj.orderId=payloadData.orderId?payloadData.orderId :null;
    if(values)
    values=JSON.parse(JSON.stringify(values));
    
    let keys = inputKeysObj.keys || [];
    for (let i = 0; i < keys.length; i++) {
      keys[i].value = values[keys[i].key];
    }
    var source = inputKeysObj.message[lang];
    var template = Handlebars.compile(source);
    var message = template(values);
    source = inputKeysObj.title[lang];
    template = Handlebars.compile(source);
    var title = template(values);
    sendObj.message = message;
    sendObj.title = title;
    sendObj.keys = keys;
    sendObj.data = values;
    sendObj.eventType = eventType;
    return sendObj;
};
module.exports = {
    issue: issue,
    verify: verify,
    setPrecision : setPrecision,
    renderTemplateField : renderTemplateField
};