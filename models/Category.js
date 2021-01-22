const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

var Category = new Schema({
    adminId: { 
        type: ObjectId, ref: "admin"
    }, 
    name: {
        type: String,
        default: null
    },
    photo: {
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

module.exports = mongoose.model('category', Category);