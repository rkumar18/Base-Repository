function define(obj, name, value) {
    Object.defineProperty(obj, name, {
        value: value,
        enumerable: true,
        writable: false,
        configurable: true
    });
}
exports.DEVICE_TYPE = {
    WEB: 0,
    ANDROID: 1,
    IOS: 2
};

exports.ROLE = {
    ADMIN: 1,
    SUBADMIN: 2
};
exports.PUSHROLE = {
    ADMIN: 1,
    RESTURANT: 2,
    DRIVER: 3
};
exports.ORDER_STATUS = {
    PREPARING: 0,
    READYTOPICK: 1,
    COMPLETED: 2,
    CANCELLED: 3
}
exports.DRIVER_STATUS = {
    ACCEPT: 0,
    ATRESTURANT: 1,
    PICKUPED: 2,
    REACHDELIVERYLOCATION: 3,
    COMPLETED: 4,
    PENDING:5
}
exports.PAY_TYPE = {
    PERHOUR: 1,
    FIXED: 2
}
exports.PAYMENT_TYPE = {
    CASH: 1,
    ONLINE: 2
}
exports.OTP_REQUEST_TYPE = {};
define(exports.OTP_REQUEST_TYPE, 'LOGIN_OTP', 1);
define(exports.OTP_REQUEST_TYPE, 'SIGNUP_OTP', 2);
define(exports.OTP_REQUEST_TYPE, 'VERIFICATION_OTP', 3);
define(exports.OTP_REQUEST_TYPE, 'PASSWORD_RESET_OTP', 5);
define(exports.OTP_REQUEST_TYPE, 'ACCOUNT_DEACTIVATE', 9);
define(exports.OTP_REQUEST_TYPE, 'ACCOUNT_ACTIVATE', 10);



exports.responseMessages = {};
define(exports.responseMessages, 'PARAMETER_MISSING', 'Insufficient information was supplied. Please check and try again.');
define(exports.responseMessages, "SOMETHING_WENT_WRONG", "Something went wrong. Please try again later");
define(exports.responseMessages, 'ACTION_COMPLETE', 'Successful');




//FOR FLAGS
exports.responseFlags = {};
define(exports.responseFlags, 'PARAMETER_MISSING', 100);
define(exports.responseFlags, 'SHOW_ERROR_MESSAGE', 201);
define(exports.responseFlags, 'ACTION_COMPLETE', 200);

exports.redisKeyExpire = 86400; //3600*24

exports.userRedisKey = "USER-";
exports.webappRedisKey = "WEB_APP-";

exports.requestMethods = {
    GET: "GET",
    POST: "POST"
};

exports.MAIL_TYPE = {
    TEXT: 'text',
    HTML: "html"
};

exports.PUSH_TYPE = {
    1: {
        keys: [],
        message: {
            en: "{{restaurantId.name}} create a booking.",
            ar: "{{restaurantId.name}} create a booking. ar"
        },
        title: {
            en: "{{restaurantId.name}} create a booking.",
            ar: "{{restaurantId.name}} create a booking. ar"
        }
    },
    2: {
        keys: [],
        message: {
            en: "{{restaurantId.name}} change order status to ready to pickup.",
            ar: "{{restaurantId.name}} change order status to ready to pickup. ar"
        },
        title: {
            en: "{{restaurantId.name}} change order status to ready to pickup.",
            ar: "{{restaurantId.name}} change order status to ready to pickup. ar"
        }
    },
    3: {
        keys: [],
        message: {
            en: "{{restaurantId.name}} food preparing time is over.",
            ar: "{{restaurantId.name}} food preparing time is over. ar"
        },
        title: {
            en: "{{restaurantId.name}} food preparing time is over.",
            ar: "{{restaurantId.name}} food preparing time is over. ar"
        }
    },
    4: {
        keys: [],
        message: {
            en: "Register a new user.",
            ar: "Register a new user."
        },
        title: {
            en: "Register a new user.",
            ar: "Register a new user."
        }
    },
    5: {
        keys: [],
        message: {
            en: "{{driverId.name}} have a new order request from {{restaurantId.name}} resturant.",
            ar: "{{driverId.name}} have a new order request from {{restaurantId.name}} resturant. ar"
        },
        title: {
            en: "{{driverId.name}} have a new order request from {{restaurantId.name}} resturant.",
            ar: "{{driverId.name}} have a new order request from {{restaurantId.name}} resturant. ar"
        }
    },
    6: {
        keys: [],
        message: {
            en: "{{restaurantId.name}} your food is pickup by {{driverId.name}}.",
            ar: "{{restaurantId.name}} your food is pickup by {{driverId.name}}. ar"
        },
        title: {
            en: "{{restaurantId.name}} your food is pickup by {{driverId.name}}.",
            ar: "{{restaurantId.name}} your food is pickup by {{driverId.name}}. ar"
        }
    },
    7: {
        keys: [],
        message: {
            en: "{{restaurantId.name}} your food is delivered.",
            ar: "{{restaurantId.name}} your food is delivered. ar"
        },
        title: {
            en: "{{restaurantId.name}} your food is delivered.",
            ar: "{{restaurantId.name}} your food is delivered. ar"
        }
    },
    8: {
        keys: [],
        message: {
            en: "{{driverId.name}} at resturant {{restaurantId.name}}.",
            ar: "{{driverId.name}} at resturant {{restaurantId.name}}. ar"
        },
        title: {
            en: "{{driverId.name}} at resturant {{restaurantId.name}}.",
            ar: "{{driverId.name}} at resturant {{restaurantId.name}}. ar"
        }
    },
    9: {
        keys: [],
        message: {
            en: "{{driverId.name}} pickup the order of resturant {{restaurantId.name}}.",
            ar: "{{driverId.name}} pickup the order of resturant {{restaurantId.name}}. ar"
        },
        title: {
            en: "{{driverId.name}} pickup the order of resturant {{restaurantId.name}}.",
            ar: "{{driverId.name}} pickup the order of resturant {{restaurantId.name}}. ar"
        }
    },
    10: {
        keys: [],
        message: {
            en: "{{driverId.name}} reached the location of delivery.",
            ar: "{{driverId.name}} reached the location of delivery. ar"
        },
        title: {
            en: "{{driverId.name}} reached the location of delivery.",
            ar: "{{driverId.name}} reached the location of delivery. ar"
        }
    },
    11: {
        keys: [],
        message: {
            en: "{{driverId.name}} completed your order.",
            ar: "{{driverId.name}} completed your order. ar"
        },
        title: {
            en: "{{driverId.name}} completed your order.",
            ar: "{{driverId.name}} completed your order. ar"
        }
    }
};
exports.PUSH_TYPE_KEYS = {
    NEW_BOOKING_CREATED: 1,
    ORDER_STATUS_CHANGED_BY_RESTURANT: 2,
    ORDER_STATUS_AUTO_CHANGED: 3,
    NEW_USER_REGISTER: 4,
    ASSIGN_DRIVER: 5,
    ASSIGN_DRIVER_TO_RESTURANT: 6,
    ORDER_IS_DELIVERED: 7,
    DRIVER_AT_RESTURANT: 8,
    DRIVER_PICKUP_ORDER: 9,
    DRIVER_REACHED_LOCATION : 10,
    DRIVER_COMPLETED_ORDER : 11
}