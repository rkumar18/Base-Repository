

const mongoLib = require('../../../lib/database/services/mongoService');


exports.insertUserInDatabase = insertUserInDatabase;
exports.insertUserSettings = insertUserSettings;
exports.generateUserId = generateUserId;
exports.getUserDetails = getUserDetails;
exports.updateUserDetails = updateUserDetails;
exports.insertUserOtpRequest = insertUserOtpRequest;
exports.getUserOtp = getUserOtp;
exports.updateUserOtpRequests = updateUserOtpRequests;
exports.insertBusinessInfo = insertBusinessInfo;
exports.updateBusinessInfo = updateBusinessInfo;

exports.checkUniqueEmail = checkUniqueEmail;
exports.checkUniquePhone = checkUniquePhone;

function generateUserId() {
    return ('U_' + (new Date().getTime()).toString().slice(0, 12));
}

function generateBusinessId() {
    return ('B_' + (new Date().getTime()).toString().slice(0, 12));
}

function insertUserInDatabase(apiContext, insertData) {
    return new Promise((resolve) => {
        Promise.coroutine(function* () {

            const finalUserId = generateUserId();

            const insertObject = {
                user_id: finalUserId,
                first_name: insertData.first_name,
                last_name: insertData.last_name,
                username: insertData.username || insertData.first_name,
                email: insertData.email,
                password: insertData.password,
                country_code: insertData.country_code,
                phone: insertData.phone,
                user_type: insertData.user_type,
                setup_step: insertData.setup_step,
                is_active: insertData.is_active,
                is_verified: insertData.is_verified,
                is_deleted: insertData.is_deleted,
                is_universal_user: insertData.is_universal_user,
                is_business_user: insertData.is_business_user,
                is_owner: insertData.is_owner,
                updated_at: new Date()
            }
            const insertResult = yield mongoLib.insertOne(apiContext, config.get("mongoDbCollections.users-table"), insertObject);
            if (insertResult && insertResult.insertedCount){
                return insertObject;
            }
            return false;
        })()
            .then((data) => {
                resolve(data);
            })
            .catch((error) => {
                resolve(false);
            });
    });
}

function insertUserSettings(apiContext, insertData) {
    return new Promise((resolve) => {
        Promise.coroutine(function* () {
            const insertObject = {
                user_id: insertData.user_id,
                timezone: insertData.timezone,
                app_version: insertData.app_version,
                device_type: insertData.device_type,
                device_token: insertData.device_token,
            }
            const insertResult = yield mongoLib.insertOne(apiContext, config.get("mongoDbCollections.users-tableettings"), insertObject);
            return insertResult;
        })()
            .then((data) => {
                resolve(data);
            })
            .catch((error) => {
                resolve(false);
            });
    });
}

function insertBusinessInfo(apiContext, insertData) {
    return new Promise((resolve) => {
        Promise.coroutine(function* () {

            const generatedBusinessId = generateBusinessId();
            let insertObject = {
                user_id: insertData.user_id,
                business_id: generatedBusinessId,
                business_name: insertData.business_name,
                business_website: insertData.business_website,
                business_address: insertData.comapny_address,
                business_pincode: insertData.business_pincode,
                business_domain: insertData.business_domain,
                business_country: insertData.business_country,
                business_timezone: insertData.business_timezone,
                verification_status: insertData.verification_status || 1,
                payment_status: insertData.payment_status || 0,
                is_active: insertData.is_active || 1,
                is_deleted: 0,
                updated_at: new Date()
            }
            const insertResult = yield mongoLib.insertOne(apiContext, config.get("mongoDbCollections.BusinessUsers"), insertObject);
            if (insertResult) {
                return generatedBusinessId;
            }
            return false
        })()
            .then((data) => {
                resolve(data);
            })
            .catch((error) => {
                resolve(false);
            });
    });
}

function getUserDetails(apiContext, userOpts, options) {
    return new Promise((resolve) => {
        Promise.coroutine(function* () {
            const criteria = {};
            if (userOpts.is_active !== undefined) {
                criteria.is_active = userOpts.is_active;
            }
            if (userOpts.is_deleted !== undefined) {
                criteria.is_deleted = userOpts.is_deleted;
            }
            if (userOpts.user_id) {
                criteria.user_id = userOpts.user_id;
            }
            if (userOpts.access_token) {
                criteria.access_token = userOpts.access_token;
            }
            if (userOpts.email) {
                criteria.email = userOpts.email;
            }
            if (userOpts.password) {
                criteria.password = userOpts.password;
            }
            if (userOpts.country_code) {
                criteria.country_code = userOpts.country_code;
            }
            if (userOpts.phone) {
                criteria.phone = userOpts.phone;
            }
            if (userOpts.invite_code) {
                criteria.invite_code = userOpts.invite_code;
            }
            if (userOpts.user_type) {
                criteria.user_type = userOpts.user_type;
            }
            const fetchDetails = yield mongoLib.findOne(apiContext, config.get("mongoDbCollections.users-table"), criteria, options);
            return fetchDetails;
        })()
            .then((data) => {
                resolve(data);
            })
            .catch((error) => {
                logger.error(error);
                resolve(false);
            });
    });
}

function updateUserDetails(apiContext, requestCriteria, updateRequest) {
    return new Promise((resolve) => {
        Promise.coroutine(function* () {
            const criteria = {};
            if (requestCriteria.user_id) {
                criteria.user_id = requestCriteria.user_id;
            }
            if (requestCriteria.access_token) {
                criteria.access_token = requestCriteria.access_token;
            }
            if (requestCriteria.email) {
                criteria.email = requestCriteria.email;
            }
            if (requestCriteria.password) {
                criteria.password = requestCriteria.password;
            }
            if (requestCriteria.country_code) {
                criteria.country_code = requestCriteria.country_code;
            }
            if (requestCriteria.phone) {
                criteria.phone = requestCriteria.phone;
            }
            const updateResult = yield mongoLib.updateOne(apiContext, config.get("mongoDbCollections.users-table"), criteria, updateRequest);
            return updateResult;
        })()
            .then((data) => {
                resolve(data);
            })
            .catch((error) => {
                logger.error(error);
                resolve(false);
            });
    });
}

function insertUserOtpRequest(apiContext, insertData) {
    return new Promise((resolve) => {
        Promise.coroutine(function* () {
            const insertObject = {
                user_id: insertData.user_id,
                otp: insertData.otp,
                otp_type: insertData.otp_type,
                expired_at: insertData.expired_at,
                is_active: insertData.is_active || 1,
                is_valid: insertData.is_valid || 1,
                is_deleted: insertData.is_deleted || 0,
                updated_at: new Date()
            }
            const insertResult = yield mongoLib.insertOne(apiContext, config.get("mongoDbCollections.OtpRequests"), insertObject);
            return insertResult;
        })()
            .then((data) => {
                resolve(data);
            })
            .catch((error) => {
                resolve(false);
            });
    });
}


function getUserOtp(apiContext, requestOptions) {
    return new Promise((resolve) => {
        Promise.coroutine(function* () {

            const criteria = {};
            if (requestOptions.is_active !== undefined) {
                criteria.is_active = requestOptions.is_active;
            } else {
                criteria.is_active = 1;
            }
            if (requestOptions.is_deleted !== undefined) {
                criteria.is_deleted = requestOptions.is_deleted;
            } else {
                criteria.is_deleted = 0;
            }
            if (requestOptions.is_valid !== undefined) {
                criteria.is_valid = requestOptions.is_valid;
            } else {
                criteria.is_valid = 1;
            }
            if (requestOptions.user_id) {
                criteria.user_id = requestOptions.user_id;
            }
            if (requestOptions.otp) {
                criteria.otp = requestOptions.otp;
            }
            if (requestOptions.otp_type) {
                criteria.otp_type = requestOptions.otp_type;
            }
            if (requestOptions.source) {
                criteria.source = requestOptions.source;
            }
            if (requestOptions.failed_attempts) {
                criteria.failed_attempts = requestOptions.failed_attempts;
            }
            if (requestOptions.last_requested) {
                criteria.last_requested = requestOptions.last_requested;
            }
            if (requestOptions.check_expired) {
                criteria.expired_at = { $gte: new Date() };
            }
            const options = {
                sort: { _id: -1 }
            }
            const fetchDetails = yield mongoLib.find(apiContext, config.get("mongoDbCollections.OtpRequests"), criteria, options);
            return fetchDetails[0];
        })()
            .then((data) => {
                resolve(data);
            })
            .catch((error) => {
                resolve(false);
            });
    });
}



function updateUserOtpRequests(apiContext, requestCriteria, updateRequest) {
    return new Promise((resolve) => {
        Promise.coroutine(function* () {

            if (!Object.keys(requestCriteria).length || !requestCriteria.user_id) {
                return false;
            }
            if (!updateRequest) {
                updateRequest = {
                    is_active: 0,
                    is_valid: 0,
                    is_deleted: 1,
                    updated_at: new Date()
                };
            }
            const criteria = {};
            if (requestCriteria.is_active !== undefined) {
                criteria.is_active = requestCriteria.is_active;
            } else {
                criteria.is_active = 1;
            }
            if (requestCriteria.is_valid !== undefined) {
                criteria.is_valid = requestCriteria.is_valid;
            } else {
                criteria.is_valid = 1;
            }
            if (requestCriteria.is_deleted !== undefined) {
                criteria.is_deleted = requestCriteria.is_deleted;
            } else {
                criteria.is_deleted = 0;
            }
            if (requestCriteria.user_id) {
                criteria.user_id = requestCriteria.user_id;
            }
            if (requestCriteria.otp_type) {
                criteria.otp_type = requestCriteria.otp_type;
            }
            const options = {};
            const updateResult = yield mongoLib.updateMany(apiContext, config.get("mongoDbCollections.OtpRequests"),
                criteria, updateRequest, options);
            return updateResult;
        })()
            .then((data) => {
                resolve(data);
            })
            .catch((error) => {
                resolve(false);
            });
    });
}


function checkUniqueEmail(apiContext, checkOptions) {
    return new Promise((resolve) => {
        Promise.coroutine(function* () {
            if (!checkOptions || !checkOptions.email) {
                return false;
            }
            const criteria = {
                email: checkOptions.email
            }
            const result = yield mongoLib.findOne(apiContext, config.get("mongoDbCollections.users-table"), criteria);
            if (result && result.user_id) {
                return false;
            }
            return true;
        })()
            .then((data) => {
                resolve(data);
            })
            .catch((error) => {
                resolve(false);
            });
    });
}

function checkUniquePhone(apiContext, checkOptions) {
    return new Promise((resolve) => {
        Promise.coroutine(function* () {
            if (!checkOptions || !checkOptions.country_code || !checkOptions.phone) {
                return false;
            }
            const criteria = {
                country_code: checkOptions.country_code,
                phone: checkOptions.phone
            }
            const result = yield mongoLib.findOne(apiContext, config.get("mongoDbCollections.users-table"), criteria);
            if (result && result.user_id) {
                return false;
            }
            return true;
        })()
            .then((data) => {
                resolve(data);
            })
            .catch((error) => {
                resolve(false);
            });
    });
}

function updateBusinessInfo(apiContext, requestData) {
    return new Promise((resolve) => {
        Promise.coroutine(function* () {
            if(!requestData.user_id || !requestData.business_id){
                return false;
            }
            const criteria = {
                user_id: requestData.user_id,
                business_id: requestData.business_id,
                is_active: 1,
                is_deleted: 0,
            }
            const updateData = {
                user_id: requestData.user_id,
                business_id: requestData.business_id,
                payment_status: requestData.payment_status,
                verification_status: requestData.verification_status,
                is_active: requestData.is_active,
                is_deleted: requestData.is_deleted,
                updated_at: new Date()
            }
            const result = yield mongoLib.findOneAndUpdate(apiContext, config.get("mongoDbCollections.BusinessUsers"), criteria, updateData, { returnNewDocument: true });
            if (!result || !result.value) {
                return false;
            }
            return result.value;
        })()
            .then((data) => {
                resolve(data);
            })
            .catch((error) => {
                resolve(false);
            });
    });
}