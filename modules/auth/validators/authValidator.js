const Joi = require('@hapi/joi');
const validator = require('../../validators/validator');

const CONTEXT = "auth";
const allowedDeviceTypes = [
    CONSTANTS.DEVICE_TYPE.WEB,
    CONSTANTS.DEVICE_TYPE.ANDROID,
    CONSTANTS.DEVICE_TYPE.IOS
]