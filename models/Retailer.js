const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const constant = require('../lib/constants/constants')

var RetailerModel = new Schema({
    name: {
        type: String,
        default: null
    },
    phone: {
        type: String,
        default: null
    },
    photo: {
        type: String,
        default: null
    },
    address: {
        type: String,
        default: null
    },
    email: {
        type: String,
        default: null
    },
    password: {
        type: String,
        default: null
    },
    isActive: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    deviceType: {
        type: String,
        enum: [constant.DEVICE_TYPE.WEB,constant.DEVICE_TYPE.ANDROID,constant.DEVICE_TYPE.IOS]
    },
    deviceToken: {
        type: String,
        default: null
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    }
})

module.exports = mongoose.model('retailer', RetailerModel);