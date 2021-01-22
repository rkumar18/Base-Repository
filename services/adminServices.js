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
//CMS Management Services
exports.addCms = addCms;
exports.getCms = getCms;
//Retailer Management Services
exports.getRetailer = getRetailer;
exports.updateRetailerDetails = updateRetailerDetails;
exports.getRetailerById = getRetailerById;
//Category Management Services
exports.addCategory = addCategory;
exports.getAllCategory = getAllCategory;
exports.updateCategory = updateCategory;
exports.getCategoryById = getCategoryById;
//Inventory Management Services
exports.addProduct = addProduct;
exports.getAllProduct = getAllProduct;
exports.updateProduct = updateProduct;
exports.getProductById = getProductById;
//Supplier Management Services
exports.addSupplier = addSupplier;
exports.getAllSupplier = getAllSupplier;
exports.updateSupplierDetails = updateSupplierDetails;
exports.getSupplierById = getSupplierById;

exports.getRestaurantOrderCsv = getRestaurantOrderCsv;
exports.getOrderCsv = getOrderCsv;

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
function addCms(data, jwtDecodedData) {
    return new Promise((resolve, reject) => {
        Promise.coroutine(function* () {
            const privacyPolicy = data.privacyPolicy || "";
            const termsAndConditions = data.termsAndConditions || "";
            const aboutUs = data.aboutUs || "";
            let adminId = jwtDecodedData._id;
            const role = data.role;
            const manValues = [adminId]
            if (commonFunction.checkBlank(manValues)) {
                return reject(responses.responseMessages.PARAMETER_MISSING)
            }
            logger.info({
                context: "Add addCms ",
                event: "addCms",
                msg: data
            });
            if (role == constants.ROLE.SUBADMIN) {
                const checkRole = yield Models.AdminModel.findOne({ role: constants.ROLE.ADMIN });
                if (!checkRole) {
                    return reject(responses.responseMessages.FAILURE)
                }
                adminId = checkRole._id;
            }
            let dataObject = {
                privacyPolicy: privacyPolicy,
                termsAndConditions: termsAndConditions,
                adminId: adminId,
                aboutUs: aboutUs
            }
            const addCms = yield Models.CmsModel.findOneAndUpdate({
                adminId: adminId
            }, dataObject, {
                upsert: true,
                new: true
            }).then(saveresult => {
                return resolve(saveresult)
            }).catch(error => {
                if (error.errors)
                    return reject(commonFunction.handleValidation(error))
                return reject(error)
            })
        })();
    });
}
function getCms(data, jwtDecodedData) {
    return new Promise((resolve, reject) => {
        Promise.coroutine(function* () {
            let adminId = jwtDecodedData._id;
            const role = data.role;
            const manValues = [adminId]
            if (commonFunction.checkBlank(manValues)) {
                return reject(responses.responseMessages.PARAMETER_MISSING)
            }
            if (role == constants.ROLE.SUBADMIN) {
                const checkRole = yield Models.AdminModel.findOne({ role: constants.ROLE.ADMIN });
                if (!checkRole) {
                    return reject(responses.responseMessages.FAILURE)
                }
                adminId = checkRole._id;
            }
            const cmsData = yield Models.CmsModel.findOne({
                adminId: adminId
            });
            if (!cmsData) {
                return {
                    status: false,
                    reason: "Unable to fetch cms data"
                };
            }
            return resolve(cmsData);
        })();
    });
}
function getRetailer(data, jwtDecodedData) {
    return new Promise((resolve, reject) => {
        Promise.coroutine(function* () {
            const page = data.page;
            const limit = data.limit || 10;
            let count = 0;
            let retailer;
            count = yield Models.RetailerModel.countDocuments({
                isDeleted: false
            });
            retailer = yield Models.RetailerModel.find({
                isDeleted: false
            }).limit(limit).skip(limit * page).sort({
                createdAt: -1
            })
            if (!retailer) {
                return reject({
                    status: false,
                    reason: responses.responseMessages.ERROR
                });
            }
            let finalSearchData = [];
            for (let i = 0; i < retailer.length; i++) {
                finalSearchData.push({
                    name: retailer[i].name
                })
                finalSearchData.push({
                    phone: retailer[i].phone
                })
                finalSearchData.push({
                    email: retailer[i].email
                })
            }
            if (data.search != null) {
                let dataService = _.filter(finalSearchData, (itm) => {
                    const val2Str = Object.values(flatten(itm)).join("");
                    return _.includes(val2Str.toLowerCase(), data.search.toLowerCase());
                });
                if (dataService.length == 0) {
                    retailer = [];
                }
                let result1 = []
                for (let j = 0; j < dataService.length; j++) {
                    dataService[j].isDeleted = false;
                    let serviceData = yield Models.RetailerModel.findOne(dataService[j])
                    result1.push(serviceData)
                }
                let jsonObject = result1.map(JSON.stringify);
                uniqueSet = new Set(jsonObject);
                resultData = Array.from(uniqueSet).map(JSON.parse);
                retailer = resultData;
                count = retailer.length
            }
            return resolve({
                retailer,
                count
            });
        })();
    });
}
function updateRetailerDetails(data, jwtDecodedData) {
    return new Promise((resolve, reject) => {
        return Promise.coroutine(function* () {
            let id = jwtDecodedData._id;
            const retailerId = data.retailerId;
            if (!retailerId) {
                return {
                    msg: responses.responseMessages.PARAMETER_MISSING,
                    status: responses.responseFlags.PARAMETER_MISSING
                }
            }
            let updateResult = yield Models.RetailerModel.findOneAndUpdate({
                _id: ObjectId(retailerId)
            }, {
                $set: data
            }, {
                new: true
            })
            if (!updateResult) {
                return {
                    status: false,
                    reason: "UPDATE ERROR"
                };
            }
            if (updateResult.isActive == true) {
                const sendConfirmationMail = yield sendgridService.sendActivationEmail(updateResult);
            }
            return resolve(updateResult)
        })();
    })
}
function getRetailerById(data, jwtDecodedData) {
    return new Promise((resolve, reject) => {
        Promise.coroutine(function* () {
            const adminId = jwtDecodedData._id;
            const retailerId = data.retailerId;
            const manValues = [adminId, retailerId];
            if (commonFunction.checkBlank(manValues)) {
                return reject(responses.responseMessages.PARAMETER_MISSING)
            }
            let criteria = {
                _id: ObjectId(retailerId),
                isDeleted: false
            }
            let retailerDetails = yield Models.RetailerModel.findOne(criteria)
            return resolve(retailerDetails)
        })();
    })
}
function addCategory(data, jwtDecodedData) {
    return Promise.coroutine(function* () {
        const adminId = jwtDecodedData._id;
        const name = data.name;
        const photo = data.photo;
        const manValues = [adminId, name];
        if (commonFunction.checkBlank(manValues)) {
            return reject(responses.responseMessages.PARAMETER_MISSING)
        }
        const saveData = {
            adminId: adminId,
            name: name,
            photo: photo
        }
        const result = yield Models.CategoryModel(saveData).save();
        return resolve(result);
    })();
}
function getAllCategory(data, jwtDecodedData) {
    return Promise.coroutine(function* () {
        const adminId = jwtDecodedData._id;
        const page = data.page;
        const limit = data.limit || 10;
        const manValues = [adminId];
        if (commonFunction.checkBlank(manValues)) {
            return reject(responses.responseMessages.PARAMETER_MISSING)
        }
        let criteria = {
            adminId: adminId,
            isDeleted: false
        }
        const count = yield Models.CategoryModel.countDocuments(criteria);
        let categoryList = yield Models.CategoryModel.find(criteria).limit(limit).skip(limit * page).sort({
            createdAt: -1
        });
        return resolve({ categoryList, count })
    })();
}
function updateCategory(data, jwtDecodedData) {
    return Promise.coroutine(function* () {
        const adminId = jwtDecodedData._id;
        const categoryId = data.categoryId;
        const manValues = [adminId, categoryId];
        if (commonFunction.checkBlank(manValues)) {
            return reject(responses.responseMessages.PARAMETER_MISSING)
        }
        const updateResult = yield Models.CategoryModel.findOneAndUpdate({
            adminId: adminId,
            _id: ObjectId(categoryId)
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
function getCategoryById(data, jwtDecodedData) {
    return new Promise((resolve, reject) => {
        Promise.coroutine(function* () {
            const adminId = jwtDecodedData._id;
            const categoryId = data.categoryId;
            const manValues = [adminId, categoryId];
            if (commonFunction.checkBlank(manValues)) {
                return reject(responses.responseMessages.PARAMETER_MISSING)
            }
            let criteria = {
                _id: ObjectId(categoryId),
                isDeleted: false
            }
            let categoryDetails = yield Models.CategoryModel.findOne(criteria)
            return resolve(categoryDetails)
        })();
    })
}
function addProduct(data, jwtDecodedData) {
    return Promise.coroutine(function* () {
        const adminId = jwtDecodedData._id;
        const categoryId = data.categoryId;
        const supplierId = data.supplierId;
        const name = data.name;
        const priceInDollar = data.priceInDollar;
        const priceInRupees = data.priceInRupees;
        const priceInPound = data.priceInPound;
        const photo = data.photo;
        const estimatedDispatchingDay = data.estimatedDispatchingDay;
        const isReturnable = data.isReturnable;
        const description = data.description;
        const quantity = data.quantity;

        const manValues = [adminId, categoryId, name, photo, estimatedDispatchingDay, isReturnable, description, quantity];
        if (commonFunction.checkBlank(manValues)) {
            return reject(responses.responseMessages.PARAMETER_MISSING)
        }
        let saveData = {
            adminId: adminId,
            categoryId: categoryId,
            supplierId: supplierId,
            name: name,
            priceInDollar: priceInDollar,
            priceInRupees: priceInRupees,
            priceInPound: priceInPound,
            photo: photo,
            estimatedDispatchingDay: estimatedDispatchingDay,
            isReturnable: isReturnable,
            description: description,
            quantity: quantity
        }
        let result = yield Models.ProductModel(saveData).save();
        return resolve(result);
    })();
}
function getAllProduct(data, jwtDecodedData) {
    return Promise.coroutine(function* () {
        const adminId = jwtDecodedData._id;
        const page = data.page;
        const limit = data.limit;
        const manValues = [adminId];
        if (commonFunction.checkBlank(manValues)) {
            return reject(responses.responseMessages.PARAMETER_MISSING)
        }
        let criteria = {
            adminId: adminId,
            isDeleted: false
        }
        let count = yield Models.ProductModel.countDocuments(criteria);
        let productData = yield Models.ProductModel.find(criteria).limit(limit).skip(limit * page).sort({
            createdAt: -1
        })
        if (data.search == "") {
            return reject(responses.responseMessages.PLEASE_PROVIDE_SEARCH_VALUE)
        }
        if (data.search != null) {
            let finalSearchData = [];
            for (let i = 0; i < productData.length; i++) {
                finalSearchData.push({
                    name: productData[i].name
                })
            }
            let dataService = _.filter(finalSearchData, (itm) => {
                const val2Str = Object.values(flatten(itm)).join("");
                return _.includes(val2Str.toLowerCase(), data.search.toLowerCase());
            });
            if (dataService.length == 0) {
                itemData = [];
            }
            let result1 = []
            for (let j = 0; j < dataService.length; j++) {
                dataService[j].isDeleted = false;
                let item = yield Models.ProductModel.findOne(dataService[j])
                result1.push(item)
            }
            let jsonObject = result1.map(JSON.stringify);
            uniqueSet = new Set(jsonObject);
            resultData = Array.from(uniqueSet).map(JSON.parse);
            productData = resultData;
            count = productData.length;
        }
        return resolve({
            count,
            productData
        })
    })();
}
function updateProduct(data, jwtDecodedData) {
    return Promise.coroutine(function* () {
        const adminId = jwtDecodedData._id;
        const productId = data.productId;
        const manValues = [adminId, productId];
        if (commonFunction.checkBlank(manValues)) {
            return reject(responses.responseMessages.PARAMETER_MISSING)
        }
        const updateResult = yield Models.ProductModel.findOneAndUpdate({
            adminId: adminId,
            _id: ObjectId(productId)
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
function getProductById(data, jwtDecodedData) {
    return Promise.coroutine(function* () {
        const adminId = jwtDecodedData._id;
        const productId = data.productId;
        const manValues = [adminId, productId];
        if (commonFunction.checkBlank(manValues)) {
            return reject(responses.responseMessages.PARAMETER_MISSING)
        }
        let criteria = {
            adminId: adminId,
            _id: ObjectId(productId),
            isDeleted: false
        }
        let productData = yield Models.ProductModel.findOne(criteria);
        return resolve(productData)
    })();
}
function addSupplier(data, jwtDecodedData) {
    return Promise.coroutine(function* () {
        const adminId = jwtDecodedData._id;
        const supplierName = data.name;
        const code = data.code;
        const address = data.address;
        const manValues = [adminId, supplierName, code];
        if (commonFunction.checkBlank(manValues)) {
            return reject(responses.responseMessages.PARAMETER_MISSING)
        }
        let saveData = {
            adminId: adminId,
            supplierName: supplierName,
            code: code,
            address: address
        }
        let result = yield Models.SupplierModel(saveData).save();
        return resolve(result);
    })();
}
function getAllSupplier(data, jwtDecodedData) {
    return Promise.coroutine(function* () {
        const adminId = jwtDecodedData._id;
        const page = data.page;
        const limit = data.limit;
        const manValues = [adminId];
        if (commonFunction.checkBlank(manValues)) {
            return reject(responses.responseMessages.PARAMETER_MISSING)
        }
        let criteria = {
            adminId: adminId,
            isDeleted: false
        }
        let count = yield Models.SupplierModel.countDocuments(criteria);
        let supplierDetails = yield Models.SupplierModel.find(criteria).limit(limit).skip(limit * page).sort({
            createdAt: -1
        })
        if (data.search == "") {
            return reject(responses.responseMessages.PLEASE_PROVIDE_SEARCH_VALUE)
        }
        if (data.search != null) {
            let finalSearchData = [];
            for (let i = 0; i < supplierDetails.length; i++) {
                finalSearchData.push({
                    supplierName: supplierDetails[i].supplierName
                })
            }
            let dataService = _.filter(finalSearchData, (itm) => {
                const val2Str = Object.values(flatten(itm)).join("");
                return _.includes(val2Str.toLowerCase(), data.search.toLowerCase());
            });
            if (dataService.length == 0) {
                itemData = [];
            }
            let result1 = []
            for (let j = 0; j < dataService.length; j++) {
                dataService[j].isDeleted = false;
                let item = yield Models.SupplierModel.findOne(dataService[j])
                result1.push(item)
            }
            let jsonObject = result1.map(JSON.stringify);
            uniqueSet = new Set(jsonObject);
            resultData = Array.from(uniqueSet).map(JSON.parse);
            supplierDetails = resultData;
            count = supplierDetails.length;
        }
        return resolve({
            count,
            supplierDetails
        })
    })();
}
function updateSupplierDetails(data, jwtDecodedData) {
    return Promise.coroutine(function* () {
        const adminId = jwtDecodedData._id;
        const supplierId = data.supplierId;
        const manValues = [adminId, supplierId];
        if (commonFunction.checkBlank(manValues)) {
            return reject(responses.responseMessages.PARAMETER_MISSING)
        }
        const updateResult = yield Models.SupplierModel.findOneAndUpdate({
            adminId: adminId,
            _id: ObjectId(supplierId)
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
function getSupplierById(data, jwtDecodedData) {
    return Promise.coroutine(function* () {
        const adminId = jwtDecodedData._id;
        const supplierId = data.supplierId;
        const manValues = [adminId, supplierId];
        if (commonFunction.checkBlank(manValues)) {
            return reject(responses.responseMessages.PARAMETER_MISSING)
        }
        let criteria = {
            adminId: adminId,
            _id: ObjectId(supplierId),
            isDeleted: false
        }
        let supplierDetails = yield Models.SupplierModel.findOne(criteria);
        return resolve(supplierDetails)
    })();
}

async function getRestaurantOrderCsv(data, jwtDecodedData) {
    const adminId = jwtDecodedData._id;
    const restaurantId = data.restaurantId;
    let count = 0;
    const manValues = [adminId, restaurantId];
    if (commonFunction.checkBlank(manValues)) {
        return reject(responses.responseMessages.PARAMETER_MISSING)
    }
    const restaurant = await Models.OrderModel.find({
        adminId: adminId,
        restaurantId: ObjectId(data.restaurantId)
    }).populate("userId", "name phone")
        .populate("restaurantId", "name phone")
        .populate("driverId", "name phone").cursor({})
    const fileName = "ResturantOrder.csv";
    const fileUrl = "./uploads/admin/" + fileName;
    const writableStream = fs.createWriteStream(fileUrl);
    writableStream.write(
        "S.No, Restaurant Name, Total Amount, Sub Total, Tax, Delivery Charges, Admin Commission, Pay To Restaurant, Payment Mode, Customer Name, Customer Contact, Driver Assigned\n"
    );
    restaurant
        .pipe(
            es.map(async (details, callback) => {
                count++;
                return callback(
                    null,
                    `${
                    count
                    },${
                    JSON.stringify(details.orderNo ? details.orderNo : "")
                    },${
                    JSON.stringify(details.totalItemAmount ? details.totalItemAmount : "")
                    },${
                    JSON.stringify(details.subTotal ? details.subTotal : "")
                    },${
                    JSON.stringify(details.taxAmount ? details.taxAmount : "")
                    },${
                    JSON.stringify(details.deliveryCharge ? details.deliveryCharge : 0)
                    },${
                    JSON.stringify(details.commission ? details.commission : 0)
                    },${
                    JSON.stringify(details.resturantPay ? details.resturantPay : 0)
                    },${
                    JSON.stringify(details.paymentType ? details.paymentType : "")
                    },${
                    JSON.stringify(details.userId.name ? details.userId.name : "")
                    },${
                    JSON.stringify(details.createdAt ? details.createdAt : "")
                    },${
                    JSON.stringify(details.orderStatus ? details.orderStatus : "")
                    },${
                    JSON.stringify(details.driverId.name ? details.driverId.name : "")
                    },${
                    JSON.stringify(details.driverStatus ? details.driverStatus : "")
                    }\n`
                );
            })
        )
        .pipe(writableStream);

    restaurant.on("end", async () => {
        console.log("url", fileUrl);
    });
    let fileNameSend = {
        redirection: config.get("exportUrl") + fileName,
    };
    return fileNameSend;
}
async function getOrderCsv(data, jwtDecodedData) {
    const adminId = jwtDecodedData._id;
    let count = 0;
    const manValues = [adminId];
    if (commonFunction.checkBlank(manValues)) {
        return reject(responses.responseMessages.PARAMETER_MISSING)
    }
    const restaurant = await Models.OrderModel.find({
        adminId: adminId
    }).populate("userId", "name phone")
        .populate("restaurantId", "name phone")
        .populate("driverId", "name phone").cursor({})
    const fileName = "Order.csv";
    const fileUrl = "./uploads/admin/" + fileName;
    const writableStream = fs.createWriteStream(fileUrl);
    writableStream.write(
        "S.No, Order Number, Restaurant Name, Total Amount, Sub Total, Tax, Delivery Charges, Admin Commission, Pay To Restaurant, Payment Mode, Customer Name, Customer Contact, Order Date/Time, Order Status, Driver Assigned, Driver Status\n"
    );
    restaurant
        .pipe(
            es.map(async (details, callback) => {
                count++;
                return callback(
                    null,
                    `${
                    count
                    },${
                    JSON.stringify(details.orderNo ? details.orderNo : "")
                    },${
                    JSON.stringify(details.restaurantId.name ? details.restaurantId.name : "")
                    },${
                    JSON.stringify(details.totalItemAmount ? details.totalItemAmount : "")
                    },${
                    JSON.stringify(details.subTotal ? details.subTotal : "")
                    },${
                    JSON.stringify(details.taxAmount ? details.taxAmount : "")
                    },${
                    JSON.stringify(details.deliveryCharge ? details.deliveryCharge : 0)
                    },${
                    JSON.stringify(details.commission ? details.commission : 0)
                    },${
                    JSON.stringify(details.resturantPay ? details.resturantPay : 0)
                    },${
                    JSON.stringify(details.paymentType ? details.paymentType : "")
                    },${
                    JSON.stringify(details.userId.name ? details.userId.name : "")
                    },${
                    JSON.stringify(details.userId.phone ? details.userId.phone : "")
                    },${
                    JSON.stringify(details.createdAt ? details.createdAt : "")
                    },${
                    JSON.stringify(details.orderStatus ? details.orderStatus : "")
                    },${
                    JSON.stringify(details.driverId.name ? details.driverId.name : "")
                    },${
                    JSON.stringify(details.driverStatus ? details.driverStatus : "")
                    }\n`
                );
            })
        )
        .pipe(writableStream);

    restaurant.on("end", async () => {
        console.log("url", fileUrl);
    });
    let fileNameSend = {
        redirection: config.get("exportUrl") + fileName,
    };
    return fileNameSend;
}