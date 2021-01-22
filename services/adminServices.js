const responses = require('../lib/constants/responses');
const commonFunction = require('../commonFunction');
const Models = require('../models/index');
const JwtService = require('../services/jwtServices');
const md5 = require('md5');
const moment = require('moment');
const _ = require("lodash");
const flatten = require("flat");
const path = require('path');
const sendgridService = require('../utility/email-services/sendgridService');
const fileUploadServices = require('../services/fileUploadServices');
const constants = require('../lib/constants/constants');
const mongoose = require('mongoose');
const es = require("event-stream");
const fs = require("fs");
const {
    reject,
    resolve
} = require('bluebird');
const ObjectId = mongoose.Types.ObjectId;

exports.registerAdmin = registerAdmin;
exports.loginViaPassword = loginViaPassword;
exports.sendResetPasswordLink = sendResetPasswordLink;
exports.checkPasswordResetLink = checkPasswordResetLink;
exports.resetPassswordByResetLink = resetPassswordByResetLink;
//Admin Profile Management Services
exports.changePassword = changePassword;
exports.getProfile = getProfile;
exports.editProfile = editProfile;

function registerAdmin(registerData) {
    return new Promise((resolve, reject) => {
        Promise.coroutine(function* () {
            const name = registerData.name || null;
            const email = registerData.email;
            const password = registerData.password;
            const address = registerData.address || null;
            const phone = registerData.phone || null;
            const photo = registerData.photo || null;
            const manValues = [email, password];
            if (commonFunction.checkBlank(manValues)) {
                return reject(responses.responseMessages.PARAMETER_MISSING)
            }
            logger.info({
                context: "Register Admin ",
                event: "registerAdmin",
                msg: registerData
            });
            if (!registerData.email || !registerData.password) {
                return reject(responses.responseMessages.PARAMETER_MISSING);
            }
            let dataObject = {
                name: name,
                email: email,
                password: md5(password),
                address: address,
                phone: phone,
                photo: photo,
            }
            const emailExists = yield Models.AdminModel.findOne({
                email: email
            })
            if (emailExists) {
                return reject(responses.responseMessages.EMAIL_ALREADY_REGISTERED)
            }
            const adminDetails = yield Models.AdminModel.create(dataObject)
            adminDetails.save().then(async saveresult => {
                const token = JwtService.issue({
                    _id: saveresult._id
                }, {
                    strict: false
                });
                saveresult.set('authToken', 'Bearer ' + token, {
                    strict: false
                });
                return resolve(saveresult)
            }).catch(error => {
                if (error.errors)
                    return reject(commonFunction.handleValidation(error))
                return reject(error)
            })
        })();
    });
}
function loginViaPassword(loginData) {
    return new Promise((resolve, reject) => {
        Promise.coroutine(function* () {
            if (!loginData.password || !loginData.email) {
                return reject(responses.responseMessages.PARAMETER_MISSING)
            }
            if (loginData.email && loginData.password) {
                let password = md5(loginData.password)
                const criteria = {
                    email: loginData.email,
                    password: password
                }
                const fetchDetails = yield Models.AdminModel.findOne(criteria).then(async result => {
                    if (!result) {
                        return reject(responses.responseMessages.INVALID_CREDENTIALS)
                    }
                    const token = JwtService.issue({
                        _id: result._id
                    }, {
                        strict: false
                    });
                    result.set('authToken', 'Bearer ' + token, {
                        strict: false
                    });
                    return resolve(result);
                }).catch(error => {
                    if (error.errors)
                        return reject(commonHelpers.handleValidation(error))
                    return reject(error)
                })
            }
            return reject("INVALID REQUEST");
        })();
    });
}
function sendResetPasswordLink(data) {
    return new Promise((resolve, reject) => {
        Promise.coroutine(function* () {
            const email = data.email;
            const manValues = [email];
            if (commonFunction.checkBlank(manValues)) {
                return reject(responses.responseMessages.PARAMETER_MISSING)
            }
            logger.info({
                context: "Reset Password ",
                event: "sendResetPasswordLink",
                msg: data
            });
            const admin = yield Models.AdminModel.findOne({
                email: email
            })
            if (!admin) {
                return reject(responses.responseMessages.EMAIL_NOT_REGISTERED)
            }
            const result = sendgridService.onAdminForgotPassword(admin);
            return resolve(responses.responseMessages.LINK_SENT)
        })();
    });
}
async function checkPasswordResetLink(req, res) {
    const link = await Models.LinkModel.findOne({
        _id: req.params.id
    });
    if (!link) return res.send({
        message: responses.responseMessages.PASSWORD_LINK_EXPIRED,
        status: responses.responseFlags.NO_DATA_SUCCESS
    });
    const start = moment(link.createdAt);
    const end = moment();
    if (end.diff(start, 'minutes') > 10) return res.send({
        message: responses.responseMessages.PASSWORD_LINK_EXPIRED,
        status: responses.responseFlags.NO_DATA_SUCCESS
    });
    return res.send({
        message: responses.responseMessages.SUCCESS,
        status: responses.responseFlags.SUCCESS
    })
}
async function resetPassswordByResetLink(req, res) {
    const admin = await Models.LinkModel.findOne({
        _id: req.body.link
    });
    const password = md5(req.body.password)
    const adminDetails = await Models.AdminModel.findOne({
        _id: admin.user
    })
    if ((adminDetails.password == password)) {
        res.send({
            message: responses.responseMessages.SAME_PASSWORD,
            status: responses.responseFlags.NO_DATA_SUCCESS
        })
    }
    await Models.AdminModel.updateOne({
        _id: admin.user
    }, {
        $set: {
            password: password
        }
    });
    await Models.LinkModel.deleteOne({
        _id: req.body.link
    });
    return res.send({
        message: responses.responseMessages.SUCCESS,
        status: responses.responseFlags.SUCCESS
    });
}
function changePassword(data, jwtDecodedData) {
    return new Promise((resolve, reject) => {
        Promise.coroutine(function* () {
            const oldPassword = md5(data.oldPassword);
            const newPassword = md5(data.newPassword);
            const confirmPassword = md5(data.confirmPassword);
            const manValues = [oldPassword, newPassword, confirmPassword];
            if (commonFunction.checkBlank(manValues)) {
                return reject(responses.responseMessages.PARAMETER_MISSING)
            }
            logger.info({
                context: "Change admin Password ",
                event: "changePassword",
                msg: data
            });
            const adminDetails = yield Models.AdminModel.findOne({
                _id: jwtDecodedData._id
            })
            if (!adminDetails) {
                return reject(responses.responseMessages.INVALID_TOKEN)
            }
            if (!(adminDetails.password == oldPassword)) {
                return reject(responses.responseMessages.INCORRECT_OLD_PASSWORD)
            }
            if (newPassword != confirmPassword) {
                return reject(responses.responseMessages.PASSWORD_NOT_MATCHED)
            }
            if (adminDetails.password == confirmPassword) {
                return reject(responses.responseMessages.SAME_PASSWORD)
            }
            const updatePassword = yield Models.AdminModel.updateOne({
                _id: jwtDecodedData._id
            }, {
                $set: {
                    password: confirmPassword
                }
            })
            return resolve(responses.responseMessages.PASSWORD_UPDATED)
        })();
    });
}
function getProfile(jwtDecodedData) {
    return new Promise((resolve, reject) => {
        Promise.coroutine(function* () {
            const id = jwtDecodedData._id;
            const manValues = [id]
            if (commonFunction.checkBlank(manValues)) {
                return reject(responses.responseMessages.PARAMETER_MISSING)
            }
            const profileData = yield Models.AdminModel.findOne({
                _id: id,
                isActive: true
            })
            if (!profileData) {
                return {
                    status: false,
                    reason: responses.responseMessages.ERROR
                };
            }
            return resolve(profileData);
        })();
    });
}
function editProfile(data, jwtDecodedData) {
    return Promise.coroutine(function* () {
        const id = jwtDecodedData._id;
        const manValues = [id]
        if (commonFunction.checkBlank(manValues)) {
            return reject(responses.responseMessages.PARAMETER_MISSING)
        }
        let updateAdminDetails = yield Models.AdminModel.findOneAndUpdate({
            _id: id
        }, {
            $set: data
        }, {
            new: true
        })
        if (!updateAdminDetails) {
            return {
                status: false,
                reason: "UPDATE ERROR"
            };
        }
        return updateAdminDetails
    })();
}