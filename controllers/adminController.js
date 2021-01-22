let adminServices = require('../services/adminServices');
const responseMethod = require('../lib/constants/responses');

exports.register = register;
exports.login = login;
exports.forgotPassword = forgotPassword;
exports.checkPasswordResetLink = checkPasswordResetLink;
exports.resetPassword = resetPassword;
//Admin Profile Management Controller
exports.changePassword = changePassword;
exports.getProfile = getProfile;
exports.editProfile = editProfile;
//CMS Management APIs
exports.addCms = addCms;
exports.getCms = getCms;
//Retailer Management Controller
exports.getRetailer = getRetailer;
exports.updateRetailerDetails = updateRetailerDetails;
exports.getRetailerById = getRetailerById;
//Category Management Controller
exports.addCategory = addCategory;
exports.getAllCategory = getAllCategory;
exports.updateCategory = updateCategory;
exports.getCategoryById = getCategoryById;
//Inventory Management Controller
exports.addProduct = addProduct;
exports.getAllProduct = getAllProduct;
exports.updateProduct = updateProduct;
exports.getProductById = getProductById;
//Supplier Management Controller
exports.addSupplier = addSupplier;
exports.getAllSupplier = getAllSupplier;
exports.updateSupplierDetails = updateSupplierDetails;
exports.getSupplierById = getSupplierById;

exports.getRestaurantOrderCsv = getRestaurantOrderCsv;
exports.getOrderCsv = getOrderCsv;

function register(req, res) {
  Promise.coroutine(function* () {
    const registerResult = yield adminServices.registerAdmin(req.body);
    return registerResult
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
    loginResult = yield adminServices.loginViaPassword(loginData);
    return loginResult;
  })().then((data) => {
    return responseMethod.sendSuccess(res, null, null, data);
  }, (error) => {
    return responseMethod.sendFailure(res, error);
  });
}
function forgotPassword(req, res) {
  Promise.coroutine(function* () {
    result = yield adminServices.sendResetPasswordLink(req.body);
    return result;
  })().then((data) => {
    return responseMethod.sendSuccess(res, data);
  }, (error) => {
    return responseMethod.sendFailure(res, error);
  });
}
function checkPasswordResetLink(req, res) {
  Promise.coroutine(function* () {
    result = yield adminServices.checkPasswordResetLink(req, res);
    return result;
  })().then((data) => {
    return responseMethod.responseMessages.SUCCESS
  }, (error) => {
    return responseMethod.responseMessages.FAILURE
  });
}
function resetPassword(req, res) {
  Promise.coroutine(function* () {
    result = yield adminServices.resetPassswordByResetLink(req, res);
    return result;
  })().then((data) => {
    return responseMethod.responseMessages.SUCCESS
  }, (error) => {
    return responseMethod.responseMessages.FAILURE
  });
}
function changePassword(req, res) {
  Promise.coroutine(function* () {
    const jwtDecodedData = req.decoded;
    result = yield adminServices.changePassword(req.body, jwtDecodedData);
    return result;
  })().then((data) => {
    return responseMethod.sendSuccess(res, data);
  }, (error) => {
    return responseMethod.sendFailure(res, error);
  });
}
function getProfile(req, res) {
  Promise.coroutine(function* () {
    const jwtDecodedData = req.decoded;
    const result = yield adminServices.getProfile(jwtDecodedData);
    return result
  })().then((data) => {
    return responseMethod.sendSuccess(res, null, null, data);
  }, (error) => {
    return responseMethod.sendFailure(res, error);
  });
}
function editProfile(req, res) {
  Promise.coroutine(function* () {
    const jwtDecodedData = req.decoded;
    const result = yield adminServices.editProfile(req.body, jwtDecodedData);
    return result
  })().then((data) => {
    return responseMethod.sendSuccess(res, null, null, data);
  }, (error) => {
    return responseMethod.sendFailure(res, error);
  });
}
function addCms(req, res) {
  Promise.coroutine(function* () {
    const jwtDecodedData = req.decoded;
    const result = yield adminServices.addCms(req.body, jwtDecodedData);
    return result
  })().then((data) => {
    return responseMethod.sendSuccess(res, null, null, data);
  }, (error) => {
    return responseMethod.sendFailure(res, error);
  });
}
function getCms(req, res) {
  Promise.coroutine(function* () {
    const jwtDecodedData = req.decoded;
    const cmsData = yield adminServices.getCms(req.body, jwtDecodedData);
    return cmsData
  })().then((data) => {
    return responseMethod.sendSuccess(res, null, null, data);
  }, (error) => {
    return responseMethod.sendFailure(res, error);
  });
}
function getRetailer(req, res) {
  Promise.coroutine(function* () {
    const jwtDecodedData = req.decoded;
    const restaurantData = yield adminServices.getRetailer(req.body, jwtDecodedData);
    return restaurantData
  })().then((data) => {
    return responseMethod.sendSuccess(res, null, null, data);
  }, (error) => {
    return responseMethod.sendFailure(res, error);
  });
}
function updateRetailerDetails(req, res) {
  Promise.coroutine(function* () {
    const jwtDecodedData = req.decoded;
    const result = yield adminServices.updateRetailerDetails(req.body, jwtDecodedData);
    return result
  })().then((data) => {
    return responseMethod.sendSuccess(res, null, null, data);
  }, (error) => {
    return responseMethod.sendFailure(res, error);
  });
}
function getRetailerById(req, res) {
  Promise.coroutine(function* () {
    const jwtDecodedData = req.decoded;
    const result = yield adminServices.getRetailerById(req.body, jwtDecodedData);
    return result
  })().then((data) => {
    return responseMethod.sendSuccess(res, null, null, data);
  }, (error) => {
    return responseMethod.sendFailure(res, error);
  });
}
function addCategory(req, res) {
  Promise.coroutine(function* () {
    const jwtDecodedData = req.decoded;
    const result = yield adminServices.addCategory(req.body, jwtDecodedData);
    return result
  })().then((data) => {
    return responseMethod.sendSuccess(res, null, null, data);
  }, (error) => {
    return responseMethod.sendFailure(res, error);
  });
}
function getAllCategory(req, res) {
  Promise.coroutine(function* () {
    const jwtDecodedData = req.decoded;
    const result = yield adminServices.getAllCategory(req.body, jwtDecodedData);
    return result
  })().then((data) => {
    return responseMethod.sendSuccess(res, null, null, data);
  }, (error) => {
    return responseMethod.sendFailure(res, error);
  });
}
function updateCategory(req, res) {
  Promise.coroutine(function* () {
    const jwtDecodedData = req.decoded;
    const result = yield adminServices.updateCategory(req.body, jwtDecodedData);
    return result
  })().then((data) => {
    return responseMethod.sendSuccess(res, null, null, data);
  }, (error) => {
    return responseMethod.sendFailure(res, error);
  });
}
function getCategoryById(req, res) {
  Promise.coroutine(function* () {
    const jwtDecodedData = req.decoded;
    const result = yield adminServices.getCategoryById(req.body, jwtDecodedData);
    return result
  })().then((data) => {
    return responseMethod.sendSuccess(res, null, null, data);
  }, (error) => {
    return responseMethod.sendFailure(res, error);
  });
}
function addProduct(req, res) {
  Promise.coroutine(function* () {
    const jwtDecodedData = req.decoded;
    const result = yield adminServices.addProduct(req.body, jwtDecodedData);
    return result
  })().then((data) => {
    return responseMethod.sendSuccess(res, null, null, data);
  }, (error) => {
    return responseMethod.sendFailure(res, error);
  });
}
function getAllProduct(req, res) {
  Promise.coroutine(function* () {
    const jwtDecodedData = req.decoded;
    const result = yield adminServices.getAllProduct(req.body, jwtDecodedData);
    return result
  })().then((data) => {
    return responseMethod.sendSuccess(res, null, null, data);
  }, (error) => {
    return responseMethod.sendFailure(res, error);
  });
}
function updateProduct(req, res) {
  Promise.coroutine(function* () {
    const jwtDecodedData = req.decoded;
    const result = yield adminServices.updateProduct(req.body, jwtDecodedData);
    return result
  })().then((data) => {
    return responseMethod.sendSuccess(res, null, null, data);
  }, (error) => {
    return responseMethod.sendFailure(res, error);
  });
}
function getProductById(req, res) {
  Promise.coroutine(function* () {
    const jwtDecodedData = req.decoded;
    const result = yield adminServices.getProductById(req.body, jwtDecodedData);
    return result
  })().then((data) => {
    return responseMethod.sendSuccess(res, null, null, data);
  }, (error) => {
    return responseMethod.sendFailure(res, error);
  });
}
function addSupplier(req, res) {
  Promise.coroutine(function* () {
    const jwtDecodedData = req.decoded;
    const result = yield adminServices.addSupplier(req.body, jwtDecodedData);
    return result
  })().then((data) => {
    return responseMethod.sendSuccess(res, null, null, data);
  }, (error) => {
    return responseMethod.sendFailure(res, error);
  });
}
function getAllSupplier(req, res) {
  Promise.coroutine(function* () {
    const jwtDecodedData = req.decoded;
    const result = yield adminServices.getAllSupplier(req.body, jwtDecodedData);
    return result
  })().then((data) => {
    return responseMethod.sendSuccess(res, null, null, data);
  }, (error) => {
    return responseMethod.sendFailure(res, error);
  });
}
function updateSupplierDetails(req, res) {
  Promise.coroutine(function* () {
    const jwtDecodedData = req.decoded;
    const result = yield adminServices.updateSupplierDetails(req.body, jwtDecodedData);
    return result
  })().then((data) => {
    return responseMethod.sendSuccess(res, null, null, data);
  }, (error) => {
    return responseMethod.sendFailure(res, error);
  });
}
function getSupplierById(req, res) {
  Promise.coroutine(function* () {
    const jwtDecodedData = req.decoded;
    const result = yield adminServices.getSupplierById(req.body, jwtDecodedData);
    return result
  })().then((data) => {
    return responseMethod.sendSuccess(res, null, null, data);
  }, (error) => {
    return responseMethod.sendFailure(res, error);
  });
}

function getRestaurantOrderCsv(req, res) {
  Promise.coroutine(function* () {
    const jwtDecodedData = req.decoded;
    const restaurantData = yield adminServices.getRestaurantOrderCsv(req.body, jwtDecodedData);
    return restaurantData
  })().then((data) => {
    return responseMethod.sendSuccess(res, null, null, data);
  }, (error) => {
    return responseMethod.sendFailure(res, error);
  });
}
function getOrderCsv(req, res) {
  Promise.coroutine(function* () {
    const jwtDecodedData = req.decoded;
    const restaurantData = yield adminServices.getOrderCsv(req.body, jwtDecodedData);
    return restaurantData
  })().then((data) => {
    return responseMethod.sendSuccess(res, null, null, data);
  }, (error) => {
    return responseMethod.sendFailure(res, error);
  });
}