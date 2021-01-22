const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

var Supplier = new Schema({
    adminId: { 
        type: Schema.ObjectId, ref: "admin"
    },  
    supplierName: {
        type: String,
        default: null
    },
    code: {
        type: String,
        default: null
    },
    address: {
        type: String,
        default: null
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

module.exports = mongoose.model('supplier', Supplier);