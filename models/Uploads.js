const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UploadModel = new Schema({
    user: {
        id : Schema.ObjectId
    },
    photo: {
        type: String
    }
}, {
    timestamps: true
});
const upload = mongoose.model('upload', UploadModel);
module.exports = upload;