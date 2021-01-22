const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
var connect = function() {
    return new Promise((resolve, reject) => {
        mongoose.connect('mongodb://localhost:27017/iscon-empex', {useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false}, (error, result) => {
            if (error) {
                console.log(error);
                return reject(error);
            }
            process.conn1 = mongoose.connection;
            console.log('iscon-empex successfully connected!');
            return resolve(true);
        });
    });
};
autoIncrement.initialize(mongoose);

module.exports = {
    connect: connect
};