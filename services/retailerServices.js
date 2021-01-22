const responses = require('../lib/constants/responses');
const commonFunction = require('../commonFunction');
const Models = require('../models/index');
const JwtService = require('./jwtServices');
const md5 = require('md5');
const moment = require('moment');
const constant = require('../lib/constants/constants');
const path = require('path');
const sendgridService = require('../utility/email-services/sendgridService');
const fileUploadServices = require('./fileUploadServices');
const mongoose = require('mongoose');
const {
    reject,
    resolve
} = require('bluebird');
const {
    pipeline
} = require('stream');
const { constants } = require('buffer');
const ObjectId = mongoose.Types.ObjectId;

exports.register = register;
exports.loginViaPassword = loginViaPassword;
exports.logout = logout;
exports.sendResetPasswordLink = sendResetPasswordLink;
exports.checkPasswordResetLink = checkPasswordResetLink;
exports.resetPassswordByResetLink = resetPassswordByResetLink;
//Educator Profile Management Services
exports.changePassword = changePassword;
exports.editProfile = editProfile;

exports.addItem = addItem;
exports.updateItem = updateItem;
exports.getItems = getItems;
exports.getItemById = getItemById;

exports.createOrder = createOrder;
exports.updateOrder = updateOrder;
exports.getOrders = getOrders;

exports.getUserDetail = getUserDetail;

exports.earningDashboard = earningDashboard;

exports.cronForAutoAllocation = cronForAutoAllocation;


function register(registerData) {
    return new Promise((resolve, reject) => {
        Promise.coroutine(function* () {
            const name = registerData.name;
            const address = registerData.address;
            const phone = registerData.phone;
            const email = registerData.email;
            const password = registerData.password;
            const photo = registerData.photo;
            const document = registerData.document;

            const manValues = [name, address, phone, email, password, document]
            if (commonFunction.checkBlank(manValues)) {
                return reject(responses.responseMessages.PARAMETER_MISSING)
            }
            logger.info({
                context: "Add Retailer",
                event: "addRetailer",
                msg: registerData
            });

            let dataObject = {
                name: name,
                address: address,
                phone: phone,
                email: email,
                password: md5(password),
                photo: photo,
                document: document
            }
            const emailExists = yield Models.RetailerModel.findOne({
                email: dataObject.email
            })
            const phoneExist = yield Models.RetailerModel.findOne({
                phone: dataObject.phone
            })
            if (emailExists) {
                return reject(responses.responseMessages.EMAIL_ALREADY_REGISTERED)
            }
            if (phoneExist) {
                return reject(responses.responseMessages.PHONE_ALREADY_REGISTERED)
            }
            const retailerDetails = yield Models.RetailerModel.create(dataObject)
            retailerDetails.save().then(async saveresult => {
                if (saveresult) {
                    await sendgridService.sendConfirmationMail(dataObject, password);
                }
                return resolve(saveresult)
            }).catch(error => {
                if (error.errors)
                    return reject(commonFunction.handleValidation(error))
                return reject(error)
            })
        })();
    });
}
async function cronForAutoAllocation(orderData) {
    let check = await Models.OrderModel.findOne({
        _id: orderData._id,
        orderStatus: constant.ORDER_STATUS.READYTOPICK
    })
    if (!check) {
        let result = await Models.OrderModel.findOneAndUpdate({
            _id: orderData._id
        }, {
            $set: {
                "orderStatus": constant.ORDER_STATUS.READYTOPICK
            }
        }).populate("restaurantId","name photo location")
        let payload = {
            orderId : result._id,
            restaurantId: result.restaurantId,
            adminId: result.adminId,
            rasturantImage : result.restaurantId.photo,
            userId: result.userId,
            deviceToken: "",
            title: result.title || "",
            values: result,
            isAdminNotification: true,
            isNotificationSave: true,
            pushType: constant.PUSH_TYPE_KEYS.ORDER_STATUS_AUTO_CHANGED,
            eventType: result.paymentType
        }
        process.emit("sendNotificationToAdmin", payload);
    }
}
async function calculateFare(orderData){
    let sendObj = {};
    let subTotal = 0;
    let commission = 0;
    let itemData = orderData.items;
    let deliveryCharge = 0;
    let taxAmount = 0;
    let resturantId = orderData.restaurantId;
    let totalItemAmount = 0;
    if(itemData.length > 0){
        for(let i=0; i< itemData.length; i++){
            totalItemAmount = totalItemAmount + (itemData[i].price * itemData[i].itemQuantity);
            console.log(totalItemAmount,"totalItemAmount")
        }
        subTotal = subTotal + totalItemAmount;
        console.log(subTotal,"subtotal1")
    }
    if(resturantId){
        let check = await Models.RetailerModel.findOne({
            _id: resturantId
        },{deliveryCharge:1, itemTax:1, adminCommissionPercentage:1})
        deliveryCharge = check.deliveryCharge;
        taxAmount = taxAmount + (totalItemAmount * check.itemTax)/100;
        subTotal = subTotal + deliveryCharge + taxAmount;
        commission = commission + (subTotal * check.adminCommissionPercentage)/100;
    }
    let resturantPay = subTotal - commission;
    sendObj.totalItemAmount = await JwtService.setPrecision(totalItemAmount);
    sendObj.subTotal = await JwtService.setPrecision(subTotal);
    sendObj.taxAmount = await JwtService.setPrecision(taxAmount);
    sendObj.deliveryCharge = await JwtService.setPrecision(deliveryCharge);
    sendObj.commission = await JwtService.setPrecision(commission);
    sendObj.resturantPay = await JwtService.setPrecision(resturantPay);
    return sendObj;
}
function loginViaPassword(loginData) {
    return new Promise((resolve, reject) => {
        Promise.coroutine(function* () {
            if (!loginData.password) {
                return reject(responses.responseMessages.PARAMETER_MISSING)
            }
            let password = md5(loginData.password)
            const criteria = {
                email:loginData.email,
                password: password,
                isBlocked: false,
                isDeleted: false
            }
            console.log(criteria,"criteria")
            yield Models.RetailerModel.findOne(criteria).then(async result => {
                if (!result) {
                    return reject(responses.responseMessages.INVALID_CREDENTIALS)
                }
                if(result.isActive == false) {
                    return reject(responses.responseMessages.INACTIVE_ACCOUNT)
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
            return reject("INVALID REQUEST");
        })();
    });
}
function logout(jwtDecodedData) {
    return new Promise((resolve, reject) => {
        Promise.coroutine(function* () {
            const id = jwtDecodedData._id;
            const manValues = [id]
            if (commonFunction.checkBlank(manValues)) {
                return reject(responses.responseMessages.PARAMETER_MISSING)
            }

            let restaurant = yield Models.RetailerModel.findOne({
                _id: id,
                isDeleted: false
            })
            if (!restaurant) {
                return reject(responses.responseMessages.RESTURANT_DOES_NOT_EXIST)
            }
            yield Models.DeviceModel.deleteMany({
                    restaurantId: id
                })
                .then(result => {
                    return resolve(responses.responseMessages.SUCCESS)
                }).catch(err => {
                    return reject(responses.responseMessages.ERROR);
                })
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
            const retailer = yield Models.RetailerModel.findOne({
                email: email,
                isBlocked: false
            })
            if (!retailer) {
                return reject(responses.responseMessages.EMAIL_NOT_REGISTERED)
            }
            const result = sendgridService.onRetailerForgotPassword(retailer);
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
    const educator = await Models.LinkModel.findOne({
        _id: req.body.link
    });
    const password = md5(req.body.password)
    const educatorDetails = await Models.EducatorModel.findOne({
        _id: educator.user
    })
    if ((educatorDetails.password == password)) {
        return reject(responses.responseMessages.SAME_PASSWORD)
    }
    await Models.EducatorModel.updateOne({
        _id: educator.user
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
                context: "Change restaurant Password ",
                event: "changePassword",
                msg: data
            });
            const educatorDetails = yield Models.RetailerModel.findOne({
                _id: jwtDecodedData._id
            })
            if (!(educatorDetails.password == oldPassword)) {
                return reject(responses.responseMessages.INCORRECT_OLD_PASSWORD)
            }
            if (newPassword != confirmPassword) {
                return reject(responses.responseMessages.PASSWORD_NOT_MATCHED)
            }
            if (educatorDetails.password == confirmPassword) {
                return reject(responses.responseMessages.SAME_PASSWORD)
            }
            const updatePassword = yield Models.RetailerModel.updateOne({
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
function editProfile(data, jwtDecodedData) {
    return Promise.coroutine(function* () {
        if (!jwtDecodedData._id) {
            return {
                msg: responses.responseMessages.PARAMETER_MISSING,
                status: responses.responseFlags.PARAMETER_MISSING
            }
        } else {
            let checkResturant = yield Models.RetailerModel.findOne({
                _id: jwtDecodedData._id,
                isDeleted: false
            })
            if (!checkResturant) {
                return reject(responses.responseMessages.RESTURANT_ID_INVALID)
            }
            if (checkResturant.isBlocked == true) {
                return reject({
                    message: responses.responseMessages.ADMIN_BLOCK_YOUR_ACCOUNT,
                    status: responses.responseFlags.UNAUTHORIZED_CREDENTIALS
                })
            }
        }
       
        let updateResturantDetails = yield Models.RetailerModel.findOneAndUpdate({_id: jwtDecodedData._id}, {
            $set: data
        }, {
            new: true
        })
        if (!updateResturantDetails) {
            return {
                status: false,
                reason: "UPDATE ERROR"
            };
        }
        return updateResturantDetails
    })();
}

function addItem(data, jwtDecodedData) {
    return Promise.coroutine(function* () {
        const restaurantId = jwtDecodedData._id;
        const name = data.name;
        const price = data.price;
        const manValues = [restaurantId];
        if (commonFunction.checkBlank(manValues)) {
            return reject(responses.responseMessages.PARAMETER_MISSING)
        }
        let checkResturant = yield Models.RetailerModel.findOne({
            _id: restaurantId,
            isDeleted: false
        })
        if (!checkResturant) {
            return reject(responses.responseMessages.RESTURANT_ID_INVALID)
        }
        if (checkResturant.isBlocked == true) {
            return reject({
                message: responses.responseMessages.ADMIN_BLOCK_YOUR_ACCOUNT,
                status: responses.responseFlags.UNAUTHORIZED_CREDENTIALS
            })
        }
        let saveData = {
            restaurantId: restaurantId,
            name: name,
            price: price
        }
        let result = yield Models.ItemModel(saveData).save();
        return resolve(result);
    })();
}

function updateItem(data, jwtDecodedData) {
    return Promise.coroutine(function* () {
        const restaurantId = jwtDecodedData._id;
        const itemId = data.itemId;
        const manValues = [restaurantId, itemId];
        if (commonFunction.checkBlank(manValues)) {
            return reject(responses.responseMessages.PARAMETER_MISSING)
        }
        let checkResturant = yield Models.RetailerModel.findOne({
            _id: restaurantId,
            isDeleted: false
        })
        if (!checkResturant) {
            return reject(responses.responseMessages.RESTURANT_ID_INVALID)
        }
        if (checkResturant.isBlocked == true) {
            return reject({
                message: responses.responseMessages.ADMIN_BLOCK_YOUR_ACCOUNT,
                status: responses.responseFlags.UNAUTHORIZED_CREDENTIALS
            })
        }
        const updateResult = yield Models.ItemModel.findOneAndUpdate({
            restaurantId: restaurantId,
            _id: ObjectId(itemId)
        }, {
            $set: data
        }, {
            new: true
        })
        if (!updateResult) {
            return {
                status: false,
                reason: responses.responseMessages.FAILURE
            };
        }
        return updateResult
    })();
}

function getItems(data, jwtDecodedData) {
    return Promise.coroutine(function* () {
        const restaurant = jwtDecodedData._id;
        const page = data.page;
        const limit = data.limit;
        const manValues = [restaurant];
        if (commonFunction.checkBlank(manValues)) {
            return reject(responses.responseMessages.PARAMETER_MISSING)
        }
        let checkResturant = yield Models.RetailerModel.findOne({
            _id: restaurant,
            isDeleted: false
        })
        if (!checkResturant) {
            return reject(responses.responseMessages.RESTURANT_ID_INVALID)
        }
        if (checkResturant.isBlocked == true) {
            return reject({
                message: responses.responseMessages.ADMIN_BLOCK_YOUR_ACCOUNT,
                status: responses.responseFlags.UNAUTHORIZED_CREDENTIALS
            })
        }
        let criteria = {
            restaurantId: restaurant,
            isDeleted: false
        }
        let count = yield Models.ItemModel.countDocuments(criteria);
        let itemData = yield Models.ItemModel.find(criteria).limit(limit).skip(limit * page).sort({
            createdAt: -1
        })
        return resolve({
            count,
            itemData
        })
    })();
}

function getItemById(data, jwtDecodedData) {
    return Promise.coroutine(function* () {
        const restaurant = jwtDecodedData._id;
        const itemId = data.itemId;
        const manValues = [restaurant, itemId];
        if (commonFunction.checkBlank(manValues)) {
            return reject(responses.responseMessages.PARAMETER_MISSING)
        }
        let checkResturant = yield Models.RetailerModel.findOne({
            _id: restaurant,
            isDeleted: false
        })
        if (!checkResturant) {
            return reject(responses.responseMessages.RESTURANT_ID_INVALID)
        }
        if (checkResturant.isBlocked == true) {
            return reject({
                message: responses.responseMessages.ADMIN_BLOCK_YOUR_ACCOUNT,
                status: responses.responseFlags.UNAUTHORIZED_CREDENTIALS
            })
        }
        let criteria = {
            restaurantId: restaurant,
            _id: ObjectId(itemId),
            isDeleted: false
        }
        let itemData = yield Models.ItemModel.findOne(criteria)
        return resolve(itemData)
    })();
}

function getUserDetail(data, jwtDecodedData) {
    return Promise.coroutine(function* () {
        const restaurantId = jwtDecodedData._id;
        const phone = data.phone || null;
        const latitude = data.latitude || null;
        const longitude = data.longitude || null;
        const address = data.address;
        const name = data.name;
        const manValues = [restaurantId];
        if (commonFunction.checkBlank(manValues)) {
            return reject(responses.responseMessages.PARAMETER_MISSING)
        }
        let checkResturants = yield Models.RetailerModel.findOne({
            _id: restaurantId,
            isDeleted: false
        })
        if (!checkResturants) {
            return reject(responses.responseMessages.RESTURANT_ID_INVALID)
        }
        if (checkResturants.isBlocked == true) {
            return reject({
                message: responses.responseMessages.ADMIN_BLOCK_YOUR_ACCOUNT,
                status: responses.responseFlags.UNAUTHORIZED_CREDENTIALS
            })
        }
        let checkUser;
        if (phone) {
            checkUser = yield Models.UserModel.findOne({
                phone: phone,
                isDeleted: false
            })
            if (!checkUser) {
                if (data.address) {
                    let pipeline = [];
                    pipeline.push({
                        $geoNear: {
                            "near": {
                                "type": "Point",
                                coordinates: [longitude, latitude]
                            },
                            key: "location",
                            "distanceField": "distance",
                            spherical: true,
                            minDistance: 0,
                            maxDistance: 5000
                        }
                    })
                    pipeline.push({
                        $match: {
                            _id: ObjectId(restaurantId)
                        }
                    }, {
                        $match: {
                            isBlocked: false
                        }
                    }, {
                        $match: {
                            isDeleted: false
                        }
                    })
                    let checkResturant = yield Models.RetailerModel.aggregate(pipeline)
                    if (checkResturant.length == 0) {
                        return reject(responses.responseMessages.DISTANCE_IS_MAX)
                    }else {
                        let dataSave = {
                            phone: phone,
                            name: name,
                            address: address,
                            latitude: latitude,
                            longitude: longitude
                        }
                        checkUser = yield Models.UserModel(dataSave).save();
                        let payload = {
                            restaurantId: checkResturants._id,
                            adminId: checkResturants.adminId,
                            rasturantImage : checkResturants.photo,
                            userId: checkUser._id,
                            deviceToken: "",
                            title: checkUser.title || "",
                            values: checkUser,
                            isAdminNotification: true,
                            isNotificationSave: true,
                            pushType: constant.PUSH_TYPE_KEYS.NEW_USER_REGISTER
                        }
                        console.log(payload,"nbshdbsh")
                        process.emit("sendNotificationToAdmin", payload);
                    }
                    return resolve(checkUser)
                } 
                return reject(checkUser)  
            }
            if(checkUser || checkUser != null){
                if (data.address) {
                    let pipeline = [];
                    pipeline.push({
                        $geoNear: {
                            "near": {
                                "type": "Point",
                                coordinates: [longitude, latitude]
                            },
                            key: "location",
                            "distanceField": "distance",
                            spherical: true,
                            minDistance: 0,
                            maxDistance: 5000
                        }
                    })
                    pipeline.push({
                        $match: {
                            _id: ObjectId(restaurantId)
                        }
                    }, {
                        $match: {
                            isBlocked: false
                        }
                    }, {
                        $match: {
                            isDeleted: false
                        }
                    })
                    let checkResturant = yield Models.RetailerModel.aggregate(pipeline)
                    if (checkResturant.length == 0) {
                        return reject(responses.responseMessages.DISTANCE_IS_MAX)
                    }else {
                        let dataSave = {
                            address: address,
                            latitude: latitude,
                            longitude: longitude
                        }
                        checkUser = yield Models.UserModel.findOneAndUpdate({
                            phone: phone,
                            isDeleted: false
                        },{$set: dataSave},{new: true})
                    }
                    return resolve(checkUser)
                }
                return resolve(checkUser)
            }
        }
        
    })();
}

function createOrder(data, jwtDecodedData) {
    return Promise.coroutine(function* () {
        const restaurantId = jwtDecodedData._id;
        const items = data.items || null;
        const userId = data.userId || null;
        const etaInMinutes = data.etaInMinutes;
        const paymentType = data.paymentType;
        const manValues = [restaurantId];
        if (commonFunction.checkBlank(manValues)) {
            return reject(responses.responseMessages.PARAMETER_MISSING)
        }
        let checkResturant = yield Models.RetailerModel.findOne({
            _id: restaurantId,
            isDeleted: false
        })
        if (!checkResturant) {
            return reject(responses.responseMessages.RESTURANT_ID_INVALID)
        }
        if (checkResturant.isBlocked == true) {
            return reject({
                message: responses.responseMessages.ADMIN_BLOCK_YOUR_ACCOUNT,
                status: responses.responseFlags.UNAUTHORIZED_CREDENTIALS
            })
        }
        let dataSave = {
            adminId: checkResturant.adminId,
            restaurantId: restaurantId,
            userId: userId,
            items: items,
            etaInMinutes: etaInMinutes,
            paymentType: paymentType,
        }
        if(paymentType == constant.PAYMENT_TYPE.CASH){
            dataSave.totalItemAmount = data.totalItemAmount;
            dataSave.subTotal = data.subTotal;
            dataSave.taxAmount = data.taxAmount;
            dataSave.deliveryCharge = data.deliveryCharge;
            dataSave.commission = data.commission;
            dataSave.resturantPay = data.resturantPay;
        }
        let result = yield Models.OrderModel(dataSave).save();
        if (!result) {
            return reject(responses.responseMessages.INVALID_CREDENTIALS)
        }
        if(result.paymentType == constant.PAYMENT_TYPE.ONLINE){
            let paymentData = yield calculateFare(result);
            paymentData.orderEndingTime = moment(result.createdAt).add(etaInMinutes, 'm')
            result = yield Models.OrderModel.findOneAndUpdate({
                _id: result._id
            },{$set:paymentData},{new: true})
            .populate("restaurantId", "name photo")
        }
        let payload = {
            orderId : result._id,
            restaurantId: result.restaurantId,
            adminId: result.adminId,
            rasturantImage : result.restaurantId.photo,
            userId: result.userId,
            deviceToken: "",
            title: result.title || "",
            values: result,
            isAdminNotification: true,
            isNotificationSave: true,
            pushType: constant.PUSH_TYPE_KEYS.NEW_BOOKING_CREATED,
            eventType: result.paymentType
        }
        process.emit("sendNotificationToAdmin", payload);
        process.emit("scheduleBooking", result);
        return resolve(result);
    })();
}

function updateOrder(data, jwtDecodedData) {
    return Promise.coroutine(function* () {
        const resturantId = jwtDecodedData._id;
        const orderId = data.orderId;
        const orderStatus = data.orderStatus;
        const manValues = [resturantId, orderId];
        if (commonFunction.checkBlank(manValues)) {
            return reject(responses.responseMessages.PARAMETER_MISSING)
        }
        let checkResturant = yield Models.RetailerModel.findOne({
            _id: resturantId,
            isDeleted: false
        })
        if (!checkResturant) {
            return reject(responses.responseMessages.RESTURANT_ID_INVALID)
        }
        if (checkResturant.isBlocked == true) {
            return reject({
                message: responses.responseMessages.ADMIN_BLOCK_YOUR_ACCOUNT,
                status: responses.responseFlags.UNAUTHORIZED_CREDENTIALS
            })
        }
        let orderData = yield Models.OrderModel.findOne({
            _id: ObjectId(orderId)
        });
        if (orderData.orderStatus == orderStatus) {
            return reject(responses.responseMessages.STATUS_ALREADY_CHANGED)
        }
        let result = yield Models.OrderModel.findOneAndUpdate({
            _id: ObjectId(orderId)
        }, {
            $set: data
        },{new: true})
        .populate("restaurantId", "name photo ")
        if (!result) {
            return reject(responses.responseMessages.FAILED)
        }
        if (result.orderStatus == constant.ORDER_STATUS.READYTOPICK) {
            if (moment().diff(result.orderEndingTime, "seconds") > 0) {
                process.emit("stopCronJobById", orderId);
                result = yield Models.OrderModel.findOneAndUpdate({
                    _id:orderData._id
                },{$set:{
                    "bookingStatus":constant.ORDER_STATUS.READYTOPICK
                }})
            }else{
                let payload = {
                    orderId : result._id,
                    restaurantId: result.restaurantId,
                    adminId: result.adminId,
                    rasturantImage : result.restaurantId.photo,
                    userId: result.userId,
                    deviceToken: "",
                    title: result.title || "",
                    values: result,
                    isAdminNotification: true,
                    isNotificationSave: true,
                    pushType: constant.PUSH_TYPE_KEYS.ORDER_STATUS_CHANGED_BY_RESTURANT,
                    eventType: result.paymentType
                }
                process.emit("sendNotificationToAdmin", payload);
                process.emit("stopCronJobById", orderId);
                result = yield Models.OrderModel.findOneAndUpdate({
                    _id:orderData._id
                },{$set:{
                    "bookingStatus":constant.ORDER_STATUS.READYTOPICK
                }})
            }
        }
        return resolve(result);
    })();
}

function getOrders(data, jwtDecodedData) {
    return Promise.coroutine(function* () {
        const restaurantId = jwtDecodedData._id;
        const page = data.page;
        const limit = data.limit;
        const manValues = [restaurantId];
        if (commonFunction.checkBlank(manValues)) {
            return reject(responses.responseMessages.PARAMETER_MISSING)
        }
        let checkResturant = yield Models.RetailerModel.findOne({
            _id: restaurantId,
            isDeleted: false
        })
        if (!checkResturant) {
            return reject(responses.responseMessages.RESTURANT_ID_INVALID)
        }
        if (checkResturant.isBlocked == true) {
            return reject({
                message: responses.responseMessages.ADMIN_BLOCK_YOUR_ACCOUNT,
                status: responses.responseFlags.UNAUTHORIZED_CREDENTIALS
            })
        }
        let criteria = {
            restaurantId: restaurantId,
            isDeleted: false
        }
        let count = yield Models.OrderModel.countDocuments(criteria);
        let orderData = yield Models.OrderModel.find(criteria).limit(limit).skip(limit * page).sort({
            createdAt: -1
        })
        return resolve({
            count,
            orderData
        })
    })();
}

function earningDashboard(data, jwtDecodedData) {
    return Promise.coroutine(function* () {
        const restaurantId = jwtDecodedData._id;
        const page = data.page;
        const limit = data.limit;
        const manValues = [restaurantId];
        if (commonFunction.checkBlank(manValues)) {
            return reject(responses.responseMessages.PARAMETER_MISSING)
        }
        let checkResturant = yield Models.RetailerModel.findOne({
            _id: restaurantId,
            isDeleted: false
        })
        if (!checkResturant) {
            return reject(responses.responseMessages.RESTURANT_ID_INVALID)
        }
        if (checkResturant.isBlocked == true) {
            return reject({
                message: responses.responseMessages.ADMIN_BLOCK_YOUR_ACCOUNT,
                status: responses.responseFlags.UNAUTHORIZED_CREDENTIALS
            })
        }
        let totalEarning = 0;
        let totalRevenue = 0;
        let pipeline = [];
        let count = yield Models.OrderModel.countDocuments({ restaurantId: restaurantId });
        let orderData = yield Models.OrderModel.find({ restaurantId: restaurantId })
        if (orderData.length > 0) {
            for (let i = 0; i < orderData.length; i++) {
                totalEarning = totalEarning + orderData[i].subTotal;
                totalRevenue = totalRevenue + orderData[i].resturantPay
            }
        }
        if (data.currentDate) {
            pipeline.push({
                $match: {
                    createdAt: {
                        $lte: new Date()
                    }
                }
            })
        }
        if (data.startDate && data.endDate) {
            pipeline.push({
                $match: {
                    createdAt: {
                        $gte: new Date(data.startDate),
                        $lte: new Date(data.endDate)
                    }
                }
            })
        }
        if (data.monthDate) {
            var dateObj = new Date(data.monthDate);
            var month = dateObj.getUTCMonth() + 1; //months from 1-12
            var year = dateObj.getUTCFullYear();
            pipeline.push({
                $match: {
                    "$expr": {
                        "$eq": [{
                            "$year": "$createdAt"
                        }, year],
                        "$eq": [{
                            "$month": "$createdAt"
                        }, month]
                    }
                }
            })
        }
        pipeline.push({
            $group: {
                _id: {
                    month: {
                        $month: "$createdAt"
                    },
                    year: {
                        $year: "$createdAt"
                    }
                },
                revenue: {
                    $sum: "$resturantPay"
                }
            }
        },
            {
                $sort: {
                    createdAt: 1
                }
            },
            {
                $project: {
                    year: '$_id.year',
                    revenue: '$revenue',
                    month: '$_id.month',
                    _id: 0
                }
        })
        const revenueData = yield Models.OrderModel.aggregate(pipeline);
        return resolve({
            count,
            totalEarning,
            totalRevenue,
            revenueData
        })
    })();
}