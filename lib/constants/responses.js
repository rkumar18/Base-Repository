

exports.responseMessages = {
    EMAIL_ALREADY_REGISTERED    : "This email is already registered with us. Try signing in.",
    EMAIL_NOT_REGISTERED        : "This email is not registered with us.",
    EMAIL_NOT_VERIFIED          : "This email is not verified. Please verify your email and try again.",
    EMAIL_ALREADY_VERIFIED      : "This email has already been verified. Please continue logging in.",
    EMAIL_BLOCKED               : "This email is blocked by admin.",
    INCORRECT_OLD_PASSWORD      : "Incorrect old password.",
    INVALID_CREDENTIALS         : "Invalid Credentials Provided.",
    PARAMETER_MISSING           : "Parameter missing or parameter type is wrong.",
    SERVER_ERROR                : "Some error occoured! Please contact the support team.",
    SUCCESS                     : "Successful!",
    UNAUTHORIZED                : "Unauthorized! Session Expired. Please Login again.",
    NOT_PERMITTED               : "Not Permitted! Sorry you are not authorized to perform this action",
    WRONG_OTP                   : "Wrong Verification Code",
    INVALID_SUBJECT             : "Invalid Subject Id",
    INVALID_TOPIC               : "Invalid Topic Id"
};

exports.responseFlags = {
    EMAIL_NOT_VERIFIED:     301,
    NO_DATA_SUCCESS:        201,
    PARAMETER_MISSING:      400,
    SERVER_ERROR:           503,
    SUCCESS:                200,
    UNAUTHORIZED:           401,
    WRONG_OTP:              401,
    INVALID_SUBJECT:        201,
    INVALID_TOPIC:          201
};

exports.sendCustomResponse = function(res, message, status, data){
    message = message? message : module.exports.responseMessages.SUCCESS;
    status  = status? status : module.exports.responseFlags.SUCCESS;
    data    = data? data : {};
    res.send({message, status, data});
}
