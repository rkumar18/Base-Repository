const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

var cmsModel = new Schema({
    adminId: { 
        type: Schema.ObjectId, ref: "admin"
    }, 
    privacyPolicy: {
        type: String,
        default: null

    },
    termsAndConditions: {
        type: String,
        default: null

    },
    aboutUs: {
        type: String,
        default: null
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

module.exports = mongoose.model('cms', cmsModel);