const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const constant = require('../lib/constants/constants')
const DeviceModel = new Schema({
    driverId: {
        type: Schema.Types.ObjectId,
        ref: 'driver'
    },
    resturantId: {
        type: Schema.Types.ObjectId,
        ref: 'restaurant'
    },
    deviceType: {
        type: Number,
        enum: [constant.DEVICE_TYPE.WEB, constant.DEVICE_TYPE.ANDROID, constant.DEVICE_TYPE.IOS],
        default: null
    },
    isResturant:{type:Boolean,default:false},
    isDriver:{type:Boolean,default:false},
    deviceToken: {
        type: String
    }
}, {
    timestamps: true
});
const Device = mongoose.model('Device', DeviceModel);
module.exports = Device;
