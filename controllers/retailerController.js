let retailerServices = require('../services/retailerServices');
const responseMethod = require('../lib/constants/responses');

exports.register = register;
exports.login = login;
exports.logout = logout;
exports.forgotPassword = forgotPassword;
exports.checkPasswordResetLink = checkPasswordResetLink;
exports.resetPassword = resetPassword;
exports.editProfile = editProfile;
//Restaurant Profile Management Controller
exports.changePassword = changePassword;

exports.addItem = addItem;
exports.updateItem = updateItem;
exports.getItems = getItems;
exports.getItemById = getItemById;

exports.createOrder = createOrder;
exports.updateOrder = updateOrder;
exports.getOrders = getOrders;

exports.getUserDetail = getUserDetail;

exports.earningDashboard = earningDashboard;

function register(req, res) {
  Promise.coroutine(function* () {
    const retailerDetails = yield retailerServices.register(req.body);
    return retailerDetails
  })().then((data) => {
    return responseMethod.sendSuccess(res, null, null, data);
  }, (error) => {
    return responseMethod.sendFailure(res, error);
  });
}

function login(req, res) {
  Promise.coroutine(function* () {
    const loginData = {};
    loginData.email = req.body.email;
    loginData.password = req.body.password;
    loginData.deviceType = req.body.deviceType || null;
    loginData.deviceToken = req.body.deviceToken ||null ;
    loginResult = yield retailerServices.loginViaPassword(loginData);
    return loginResult;
  })().then((data) => {
    return responseMethod.sendSuccess(res, null, null, data);
  }, (error) => {
    return responseMethod.sendFailure(res, error);
  });
}

function forgotPassword(req, res) {
  Promise.coroutine(function* () {
    result = yield retailerServices.sendResetPasswordLink(req.body);
    return result;
  })().then((data) => {
    return responseMethod.sendSuccess(res, data);
  }, (error) => {
    return responseMethod.sendFailure(res, error);
  });
}

function logout(req, res) {
  Promise.coroutine(function* () {
    const jwtDecodedData = req.decoded;
    result = yield retailerServices.logout(jwtDecodedData);
    return result;
  })().then((data) => {
    return responseMethod.sendSuccess(res, data);
  }, (error) => {
    return responseMethod.sendFailure(res, error);
  });
}

function checkPasswordResetLink(req, res) {
  Promise.coroutine(function* () {
    result = yield retailerServices.checkPasswordResetLink(req, res);
    return result;
  })().then((data) => {
    return responseMethod.responseMessages.SUCCESS
  }, (error) => {
    return responseMethod.responseMessages.FAILURE
  });
}

function resetPassword(req, res) {
  Promise.coroutine(function* () {
    result = yield retailerServices.resetPassswordByResetLink(req, res);
    return result;
  })().then((data) => {
    return responseMethod.responseMessages.SUCCESS
  }, (error) => {
    return responseMethod.responseMessages.FAILURE
  });
}

function changePassword(req, res) {
  Promise.coroutine(function* () {
    const jstDecodedData = req.decoded;
    result = yield retailerServices.changePassword(req.body, jstDecodedData);
    return result;
  })().then((data) => {
    return responseMethod.sendSuccess(res, data);
  }, (error) => {
    return responseMethod.sendFailure(res, error);
  });
}

function editProfile(req, res) {
  Promise.coroutine(function* () {
    const jwtDecodedData = req.decoded;
    const result = yield retailerServices.editProfile(req.body, jwtDecodedData);
    return result
  })().then((data) => {
    return responseMethod.sendSuccess(res, data);
  }, (error) => {
    return responseMethod.sendFailure(res, error);
  });
}

function addItem(req, res) {
  Promise.coroutine(function* () {
    const jwtDecodedData = req.decoded;
    const result = yield retailerServices.addItem(req.body, jwtDecodedData);
    return result
  })().then((data) => {
    return responseMethod.sendSuccess(res,null,null, data);
  }, (error) => {
    return responseMethod.sendFailure(res, error);
  });
}

function updateItem(req, res) {
  Promise.coroutine(function* () {
    const jwtDecodedData = req.decoded;
    const result = yield retailerServices.updateItem(req.body, jwtDecodedData);
    return result
  })().then((data) => {
    return responseMethod.sendSuccess(res, null, null, data);
  }, (error) => {
    return responseMethod.sendFailure(res, error);
  });
}

function getItems(req, res) {
  Promise.coroutine(function* () {
    const jwtDecodedData = req.decoded;
    const result = yield retailerServices.getItems(req.body, jwtDecodedData);
    return result
  })().then((data) => {
    return responseMethod.sendSuccess(res, null, null, data);
  }, (error) => {
    return responseMethod.sendFailure(res, error);
  });
}

function getItemById(req, res) {
  Promise.coroutine(function* () {
    const jwtDecodedData = req.decoded;
    const result = yield retailerServices.getItemById(req.body, jwtDecodedData);
    return result
  })().then((data) => {
    return responseMethod.sendSuccess(res, null, null, data);
  }, (error) => {
    return responseMethod.sendFailure(res, error);
  });
}

function createOrder(req, res) {
  Promise.coroutine(function* () {
    const jwtDecodedData = req.decoded;
    const result = yield retailerServices.createOrder(req.body, jwtDecodedData);
    return result
  })().then((data) => {
    return responseMethod.sendSuccess(res, data);
  }, (error) => {
    return responseMethod.sendFailure(res, error);
  });
}

function updateOrder(req, res) {
  Promise.coroutine(function* () {
    const jwtDecodedData = req.decoded;
    const result = yield retailerServices.updateOrder(req.body, jwtDecodedData);
    return result
  })().then((data) => {
    return responseMethod.sendSuccess(res, data);
  }, (error) => {
    return responseMethod.sendFailure(res, error);
  });
}

function getOrders(req, res) {
  Promise.coroutine(function* () {
    const jwtDecodedData = req.decoded;
    const result = yield retailerServices.getOrders(req.body, jwtDecodedData);
    return result
  })().then((data) => {
    return responseMethod.sendSuccess(res, null, null, data);
  }, (error) => {
    return responseMethod.sendFailure(res, error);
  });
}

function getUserDetail(req, res) {
  Promise.coroutine(function* () {
    const jwtDecodedData = req.decoded;
    const result = yield retailerServices.getUserDetail(req.body, jwtDecodedData);
    return result
  })().then((data) => {
    return responseMethod.sendSuccess(res, null, null, data);
  }, (error) => {
    return responseMethod.sendFailure(res, error);
  });
}

function earningDashboard(req, res) {
  Promise.coroutine(function* () {
    const jwtDecodedData = req.decoded;
    const result = yield retailerServices.earningDashboard(req.body, jwtDecodedData);
    return result
  })().then((data) => {
    return responseMethod.sendSuccess(res, null, null, data);
  }, (error) => {
    return responseMethod.sendFailure(res, error);
  });
}