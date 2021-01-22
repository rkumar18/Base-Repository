const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

var Product = new Schema({
    categoryId: { 
        type: Schema.ObjectId, ref: "category"
    },
    adminId: { 
        type: Schema.ObjectId, ref: "admin"
    },  
    supplierId: { 
        type: Schema.ObjectId, ref: "supplier", default: null
    },  
    name: {
        type: String,
        default: null
    },
    priceInDollar: {
        type: Number,
        default: 0
    },
    priceInRupees: {
        type: Number,
        default: 0
    },
    priceInPound: {
        type: Number,
        default: 0
    },
    photo: {
        type: String,
        default: null
    },
    estimatedDispatchingDay: {
        type: Number,
        default: null
    },
    isReturnable: {
        type: Boolean,
        default: false
    },
    description: {
        type: String,
        default: null
    },
    quantity: {
        type: Number,
        default: 0
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    isBlocked: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

module.exports = mongoose.model('product', Product);