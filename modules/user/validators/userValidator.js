const Joi = require('@hapi/joi');
const validator = require('../../validators/validator');

const CONTEXT = "user";
const allowedDeviceTypes = [
    CONSTANTS.DEVICE_TYPE.WEB,
    CONSTANTS.DEVICE_TYPE.ANDROID,
    CONSTANTS.DEVICE_TYPE.IOS
]

exports.signUp = function (req, res, next) {
    req.apiContext = {
        context: CONTEXT,
        event: "sign-up"
    };
    let schema = Joi.object({
        first_name: Joi.string().max(80).required(),
        last_name: Joi.string().max(80).optional(),
        email: Joi.string().max(100).regex(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).required(),
        password: Joi.string().min(8).max(30).regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,}$/).required(),
        country_code: Joi.string().max(10).required(),
        phone: Joi.string().max(20).required(),
        timezone: Joi.number().required(),
        app_version: Joi.number().required(),
        device_type: Joi.number().valid(...allowedDeviceTypes).required(),
        device_token: Joi.string().max(512).optional(),
        user_type: Joi.number().optional(),
        is_universal_user: Joi.number().valid(0, 1).optional(),
        is_business_user: Joi.number().valid(0, 1).optional(),
        is_owner: Joi.number().valid(1, 0).optional(),
    })

    let validFields = validator.validateSchema(req.apiContext, res, req.body, schema);
    if (validFields) {
        next();
    }
};

exports.login = function (req, res, next) {
    req.apiContext = {
        context: CONTEXT,
        event: "login"
    };
    let schema = Joi.object({
        email: Joi.string().max(100).regex(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).optional(),
        password: Joi.string().min(8).max(30).regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,}$/).optional(),
        country_code: Joi.string().max(10).optional(),
        phone: Joi.string().max(20).optional(),
        login_otp: Joi.string().min(4).max(8).optional(),
        access_token: Joi.string().max(256).optional(),
        app_version: Joi.number().optional(),
        timezone: Joi.number().optional(),
        device_type: Joi.number().valid(...allowedDeviceTypes).optional(),
        device_token: Joi.string().max(512).optional(),
        // user_type: Joi.number().required()
    })
        .xor('phone', 'email', 'access_token')
        .xor('password', 'login_otp', 'access_token')
        .with('country_code', 'phone')

    let validFields = validator.validateSchema(req.apiContext, res, req.body, schema);
    if (validFields) {
        next();
    }
};

exports.requestOtp = function (req, res, next) {
    req.apiContext = {
        context: CONTEXT,
        event: "request-otp"
    };
    let schema = Joi.object({
        email: Joi.string().max(100).regex(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).optional(),
        country_code: Joi.string().max(10).optional(),
        phone: Joi.string().max(20).optional(),
        user_id: Joi.string().max(100).optional(),
        access_token: Joi.string().max(256).optional(),
        request_type: Joi.number().required(),
        app_version: Joi.number().optional(),
        timezone: Joi.number().optional(),
        device_type: Joi.number().valid(...allowedDeviceTypes).required(),
        device_token: Joi.string().max(512).optional(),
        source: Joi.number().optional(),
    })
        .xor('phone', 'email', 'user_id')
        .with('country_code', 'phone')
        .with('user_id', 'access_token')

    let validFields = validator.validateSchema(req.apiContext, res, req.body, schema);
    if (validFields) {
        next();
    }
};

exports.setupUser = function (req, res, next) {
    req.apiContext = {
        context: CONTEXT,
        event: "setup"
    };
    let schema = Joi.object({
        user_id: Joi.string().min(12).max(100).required(),
        access_token: Joi.string().max(256).required(),
        setup_step: Joi.number().required(),
        business_name: Joi.string().max(100).required(),
        business_website: Joi.string().max(100).optional(),
        business_address: Joi.string().max(100).optional(),
        business_pincode: Joi.string().max(20).optional(),
        business_domain: Joi.string().max(100).optional(),
        business_country: Joi.string().max(100).optional(),
        business_timezone: Joi.string().max(100).optional(),
        app_version: Joi.number().optional(),
        timezone: Joi.number().optional(),
        device_type: Joi.number().valid(...allowedDeviceTypes).optional(),
        device_token: Joi.string().max(512).optional()
    })

    let validFields = validator.validateSchema(req.apiContext, res, req.body, schema);
    if (validFields) {
        next();
    }
};

exports.updateVerifyMethod = function (req, res, next) {
    req.apiContext = {
        context: CONTEXT,
        event: "update-verify-method"
    };
    let schema = Joi.object({
        user_id: Joi.string().min(12).max(100).required(),
        access_token: Joi.string().max(256).required(),
        setup_step: Joi.number().required(),
        email: Joi.string().max(100).regex(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).optional(),
        country_code: Joi.string().max(10).optional(),
        phone: Joi.string().max(20).optional(),
        app_version: Joi.number().optional(),
        timezone: Joi.number().optional(),
        device_type: Joi.number().valid(...allowedDeviceTypes).optional(),
        device_token: Joi.string().max(512).optional()
    })
        .xor('phone', 'email')
        .with('phone', 'country_code');

    let validFields = validator.validateSchema(req.apiContext, res, req.body, schema);
    if (validFields) {
        next();
    }
};


exports.logout = function (req, res, next) {
    req.apiContext = {
        context: CONTEXT,
        event: "logout"
    };
    let schema = Joi.object({
        user_id: Joi.string().min(12).max(100).required(),
        access_token: Joi.string().max(256).required(),
        app_version: Joi.number().optional(),
        timezone: Joi.number().optional(),
        device_type: Joi.number().valid(...allowedDeviceTypes).optional(),
        device_token: Joi.string().max(512).optional()
    });

    let validFields = validator.validateSchema(req.apiContext, res, req.body, schema);
    if (validFields) {
        next();
    }
};



exports.forgotPassword = function (req, res, next) {
    req.apiContext = {
        context: CONTEXT,
        event: "forgot-password"
    };
    let schema = Joi.object({
        email: Joi.string().max(100).regex(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).optional(),
        country_code: Joi.string().max(10).optional(),
        phone: Joi.string().max(20).optional(),
        app_version: Joi.number().optional(),
        timezone: Joi.number().optional(),
        device_type: Joi.number().valid(...allowedDeviceTypes).optional(),
        device_token: Joi.string().max(512).optional()
    })
        .xor('phone', 'email')
        .with('country_code', 'phone');

    let validFields = validator.validateSchema(req.apiContext, res, req.body, schema);
    if (validFields) {
        next();
    }
};




exports.resetPassword = function (req, res, next) {
    req.apiContext = {
        context: CONTEXT,
        event: "reset-password"
    };
    let schema = Joi.object({
        email: Joi.string().max(100).regex(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).optional(),
        country_code: Joi.string().max(10).optional(),
        phone: Joi.string().max(20).optional(),
        user_id: Joi.string().min(12).max(100).optional(),
        access_token: Joi.string().max(256).optional(),
        verification_otp: Joi.string().min(4).max(8).optional(),
        old_password: Joi.string().max(256).optional(),
        new_password: Joi.string().max(256).required()
    })
        .with('phone', ['country_code', "verification_otp"])
        .with('email', "verification_otp")
        .with('access_token', ['user_id', 'old_password'])
        .xor('access_token', 'email', 'phone')
        .xor('verification_otp', 'old_password');

    let validFields = validator.validateSchema(req.apiContext, res, req.body, schema);
    if (validFields) {
        next();
    }
};



exports.getProfile = function (req, res, next) {
    req.apiContext = {
        context: CONTEXT,
        event: "profile"
    };
    let schema = Joi.object({
        user_id: Joi.string().min(12).max(100).required(),
        access_token: Joi.string().max(256).required(),
        app_version: Joi.number().optional(),
        timezone: Joi.number().optional(),
        device_type: Joi.number().valid(...allowedDeviceTypes).optional(),
        device_token: Joi.string().max(512).optional()
    });

    let validFields = validator.validateSchema(req.apiContext, res, req.body, schema);
    if (validFields) {
        next();
    }
};


exports.editProfile = function (req, res, next) {
    req.apiContext = {
        context: CONTEXT,
        event: "profile-edit"
    };
    let schema = Joi.object({
        user_id: Joi.string().min(12).max(100).required(),
        access_token: Joi.string().max(256).required(),
        first_name: Joi.string().max(80).required(),
        last_name: Joi.string().max(80).optional(),
        username: Joi.string().max(80).required(),
        app_version: Joi.number().optional(),
        timezone: Joi.number().optional(),
        device_type: Joi.number().valid(...allowedDeviceTypes).optional(),
        device_token: Joi.string().max(512).optional()
    });

    let validFields = validator.validateSchema(req.apiContext, res, req.body, schema);
    if (validFields) {
        next();
    }
};

exports.verifyIdentity = function (req, res, next) {
    req.apiContext = {
        context: CONTEXT,
        event: "verify"
    };
    let schema = Joi.object({
        email: Joi.string().max(100).regex(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).optional(),
        country_code: Joi.string().max(10).optional(),
        phone: Joi.string().max(20).optional(),
        request_type: Joi.number().required(),
        verification_otp: Joi.string().min(4).max(8).required(),
    })
        .with('phone', 'country_code')
        .xor('email', 'phone')

    let validFields = validator.validateSchema(req.apiContext, res, req.body, schema);
    if (validFields) {
        next();
    }
};
