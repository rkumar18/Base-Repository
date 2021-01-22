const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const LinkModel = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    }
}, {
    timestamps: true
});
const VerificationLink = mongoose.model('VerificationLink', LinkModel);
module.exports = VerificationLink;