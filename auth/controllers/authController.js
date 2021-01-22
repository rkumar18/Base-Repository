const md5 = require('md5');
const tokenMethods = require('../../utility/utils');

const authService = require('../services/authService');
const constants = require('../../lib/constants/constants');

exports.createUser = createUser;
exports.getUserDetails = getUserDetails;
exports.initiateUserLogin = initiateUserLogin;

exports.createAdmin = createAdmin;


function createUser(apiContext, userData) {
    return Promise.coroutine(function*() {
        const checkUnique = yield checkUniqueIdentity(apiContext, userData);
        if (!checkUnique.status) {
            return checkUnique;
        }
        let dataObject = {
            first_name: userData.first_name,
            last_name: userData.last_name,
            username: userData.username || userData.first_name,
            email: userData.email,
            password: md5(userData.password),
            country_code: userData.country_code,
            phone: userData.phone,
            user_type: userData.user_type || 1,
            is_active: 1,
            is_verified: 0
        }
        const userDetails = yield authService.insertUserInDatabase(apiContext, dataObject);
        if (!userDetails || !userDetails.user_id) {
            return { status: false, reason: "UNABLE TO INSERT USER IN DB" };
        }
        const loginResult = yield initiateUserLogin(apiContext, { user_id: userDetails.user_id });
        if (!loginResult.status || !loginResult.access_token) {
            return { status: false, reason: loginResult.reason };
        }
        delete userDetails.password;
        delete userDetails._id;
        userDetails.access_token = loginResult.access_token
        return { status: true, data: userDetails };
    })();
}

function createAdmin(apiContext, adminData) {
    return Promise.coroutine(function*() {
        const checkUnique = yield checkUniqueIdentity(apiContext, adminData, constants.COLLECTION_NAME.ADMIN);
        if (!checkUnique.status) {
            return checkUnique;
        }
        let dataObject = {
            first_name: adminData.first_name,
            last_name: adminData.last_name,
            email: adminData.email,
            password: md5(adminData.password),
            country_code: adminData.country_code,
            phone: adminData.phone,
            type: adminData.type,
            is_active: true,
            is_verified: false,
            latitude: adminData.latitude,
            longitude: adminData.longitude,
            address: adminData.address,
            adminId: adminData.super_admin_id,
            country: adminData.country
        }
        const adminDetails = yield authService.insertAdminInDatabase(apiContext, dataObject, constants.COLLECTION_NAME.ADMIN);  
        if (!adminDetails || !adminDetails.adminId) {
            return { status: false, reason: "UNABLE TO INSERT ADMIN IN DB" };
        }
        return { status: true, data: adminDetails };
    })();
}

function getUserDetails(apiContext, userInfo, options) {
    return Promise.coroutine(function*() {

        const dataObject = {};
        if (userInfo.user_id) {
            dataObject.user_id = userInfo.user_id;
        }
        if (userInfo.username) {
            dataObject.username = userInfo.username;
        }
        if (userInfo.email) {
            dataObject.email = userInfo.email;
        }
        if (userInfo.password) {
            dataObject.password = md5(userInfo.password);
        }
        if (userInfo.country_code) {
            dataObject.country_code = userInfo.country_code;
        }
        if (userInfo.phone) {
            dataObject.phone = userInfo.phone;
        }
        if (userInfo.user_type) {
            dataObject.user_type = userInfo.user_type;
        }
        if (userInfo.access_token) {
            dataObject.access_token = userInfo.access_token;
        }
        const userDetails = yield authService.getUserDetails(apiContext, dataObject, options || {
            projection: { _id: 0, password: 0 }
        });
        if (!userDetails || !userDetails.user_id) {
            return { status: false, reason: "NO USER FOUND" };
        }
        return { status: true, data: userDetails };
    })();
}

function initiateUserLogin(apiContext, loginData) {
    return Promise.coroutine(function*() {

        if (!loginData.user_id) {
            return { status: false, reason: "NO USER FOUND" };
        }

        const generatedAccessToken = tokenMethods.generateAccessToken(loginData.user_id);

        const criteriaObject = {
            user_id: loginData.user_id
        }
        const dataObject = {
            access_token: generatedAccessToken
        }

        let updateResult = yield authService.updateUserDetails(apiContext, criteriaObject, dataObject);
        if (!updateResult) {
            return { status: false, reason: "LOGIN ERROR" };
        }

        return { status: true, access_token: dataObject.access_token };

    })();
}

function checkUniqueIdentity(apiContext, data, collection) {
    return Promise.coroutine(function*() {
        let checkUnique = true;
        let failReason;
        if (data.email) {
            checkUnique = yield authService.checkUniqueEmail(apiContext, { email: data.email }, collection);
            failReason = "EMAIL ALREADY_EXIST";
        }
        if (!checkUnique) {
            return { status: false, reason: failReason || "ALREADY_EXIST" };
        }
        return { status: true };
    })();
}
