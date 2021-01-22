exports.responseMessages = {
    EMAIL_ALREADY_REGISTERED: "This email is already registered with us. Try signing in.",
    EMAIL_NOT_REGISTERED: "This email is not registered with us.",
    EMAIL_NOT_VERIFIED: "This email is not verified. Please verify your email and try again.",
    EMAIL_ALREADY_VERIFIED: "This email has already been verified. Please continue logging in.",
    EMAIL_BLOCKED: "This email is blocked by admin.",
    INCORRECT_OLD_PASSWORD: "Incorrect old password.",
    INVALID_CREDENTIALS: "Invalid Credentials Provided.",
    PARAMETER_MISSING: "Parameter missing or parameter type is wrong.",
    SERVER_ERROR: "Some error occoured! Please contact the support team.",
    SUCCESS: "Successful!",
    UNAUTHORIZED: "Unauthorized! Session Expired. Please Login again.",
    NOT_PERMITTED: "Not Permitted! Sorry you are not authorized to perform this action",
    WRONG_OTP: "Wrong Verification Code",
    INVALID_SUBJECT: "Invalid Subject Id",
    INVALID_TOPIC: "Invalid Topic Id",
    FAILED: "Login Failed",
    INSERTION_FAILED: "Unable to Insert Data in Database",
    CONFIG_EXIST: "Configuration for this account already exists!",
    INVALID_TOKEN: "Token is not valid",
    TOKEN_MISSING: "Auth token is not supplied",
    INVITATION_SENT: "Invitation sent Successfully!",
    ACCESS_DENIED: "Access Denied!",
    VERIFIED: "Succesfully Verified",
    ERROR: "Something went wrong!",
    LINK_SENT: "Password reset link sent",
    PASSWORD_LINK_EXPIRED: "Password reset link expired",
    FAILURE: "Failed",
    INCORRECT_OLD_PASSWORD: "Incorrect old password",
    PASSWORD_UPDATED: "Password changed successfully",
    VERIFICATION_LINK_SENT: "Verification link sent, please check your email",
    EMAIL_SENT: "Email Sent Successfully!",
    USER_ALREADY_REGISTERED: "User is already registered with us. Try signin in.",
    PASSWORD_NOT_MATCHED: "Password did not match, try again.",
    INVALID_OTP: "Invalid otp",
    OTP_EXPIRED: "Otp expired!",
    OTP_SENT: "Otp sent, please check your email",
    PHONE_ALREADY_REGISTERED: "Driver with this phone number is already registered.",
    OTP_VERIFIED: "OTP verified successfully!",
    OTP_SENT_SUCCESSFULLY: "OTP Sent.",
    PHONE_NOT_REGISTERED: "Phone not registered with any account.",
    ALREADY_SUBSCRIBED: "Already Subscribed",
    SAME_PASSWORD: "New password can't be same as old password",
    RESTURANT_ID_INVALID: "No Restaurant Found.",
    DISTANCE_IS_MAX: "Unable to deliver order at this location.",
    STATUS_ALREADY_CHANGED: "Status allready changed.",
    ADMIN_BLOCK_YOUR_ACCOUNT: "Your account is blocked. Please contact admin.",
    RESTURANT_DOES_NOT_EXIST: "Resturant does not exist.",
    DRIVER_DOES_NOT_EXIST: "Driver does not exist.",
    PLEASE_CONTACT_ADMIN: "Please contact to admin.",
    DRIVER_DOES_NOT_EXIST : "Driver not exist.",
    NO_ONGOING_BOOKING : "No ongoing booking found.",
    PLEASE_COMPLETE_ONGOING : "Please complete your previous booking.",
    DRIVER_ID_INVALID : "Driver id is invalid.",
    INACTIVE_ACCOUNT: "Your Account is Inactive. Please Contact Admin",
    PLEASE_PROVIDE_SEARCH_VALUE : "Please provide search value."
};

exports.responseFlags = {
    EMAIL_NOT_VERIFIED: 301,
    NO_DATA_SUCCESS: 201,
    PARAMETER_MISSING: 400,
    SERVER_ERROR: 503,
    SUCCESS: 200,
    UNAUTHORIZED_CREDENTIALS: 401,
    WRONG_OTP: 401,
    INVALID_SUBJECT: 201,
    INVALID_TOPIC: 201
};

exports.sendCustomResponse = function (res, message, status, data) {
    message = message ? message : module.exports.responseMessages.SUCCESS;
    status = status ? status : module.exports.responseFlags.SUCCESS;
    data = data ? data : {};
    res.send({
        message,
        status,
        data
    });
}

exports.sendSuccess = function (res, message, status, data) {
    message = message ? message : module.exports.responseMessages.SUCCESS;
    status = status ? status : module.exports.responseFlags.SUCCESS;
    data = data ? data : {};
    res.status(status).send({
      status: status,
      message: message,
      data: data,
    });
}

exports.sendFailure = function (res, message, status, data) {
    message = message;
    status = status ? status : module.exports.responseFlags.PARAMETER_MISSING;
    data = data ? data : {};
    res.status(status).send({
        status: status,
        message: message,
        data: data,
      });
}