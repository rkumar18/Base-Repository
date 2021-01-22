const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const constant = require('../lib/constants/constants');
const autoIncrement = require('mongoose-auto-increment');

var OrderModel = new Schema({
    orderNo: { type: Number, default: 1000 },
    adminId: {
        type: ObjectId,
        ref: "admin",
        default: null
    },
    restaurantId: {
        type: ObjectId,
        ref: "restaurant",
        default: null
    },
    phone: {
        type: String,
        default: null
    }, 
    items: [{
        itemId:{
            type: ObjectId,
            ref: "item",
            default: null
        },
        price:{
            type: Number,
            default:null
        },
        itemQuantity:{
            type: Number,
            default: null
        }
    }],
    userId: {
        type: ObjectId,
        ref: "user",
        default: null
    },
    driverId: {
        type: ObjectId,
        ref: "driver",
        default: null
    },
    totalItemAmount: {
        type: Number,
        default: 0
    },
    subTotal: {
        type: Number,
        default: 0
    },
    taxAmount: {
        type: Number,
        default: 0
    },
    deliveryCharge: {
        type: Number,
        default: 0
    },
    commission: {
        type: Number,
        default: 0
    },
    resturantPay: {
        type: Number,
        default: 0
    },
    etaInMinutes: {
        type: Number,
        default: 0
    },
    orderEndingTime:{
        type: Date,
        default: null
    },
    paymentType: {
        type: Number,
        enum: [
            constant.PAYMENT_TYPE.CASH,
            constant.PAYMENT_TYPE.ONLINE
        ]
    },
    orderStatus: {
        type: Number,
        enum: [
            constant.ORDER_STATUS.PREPARING,
            constant.ORDER_STATUS.READYTOPICK,
            constant.ORDER_STATUS.COMPLETED
        ],
        default:constant.ORDER_STATUS.PREPARING
    },
    driverStatus:{
        type: Number,
        enum: [
            constant.DRIVER_STATUS.ACCEPT,
            constant.DRIVER_STATUS.ATRESTURANT,
            constant.DRIVER_STATUS.PICKUPED,
            constant.DRIVER_STATUS.REACHDELIVERYLOCATION,
            constant.DRIVER_STATUS.COMPLETED,
            constant.DRIVER_STATUS.PENDING
        ],
        default: constant.DRIVER_STATUS.PENDING
    },
    isDeleted:{
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    }
})
OrderModel.plugin(autoIncrement.plugin, {
    model: "order",
    field: "orderNo",
    startAt: 1000,
    incrementBy: 1
  });
module.exports = mongoose.model('order', OrderModel);