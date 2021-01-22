

let userService = require('../services/userService');
const responseMethod = require('../../../lib/methods/responseMethods');

exports.signUp = signUp;
exports.login = login;


function signUp(req, res) {
  Promise.coroutine(function* () {

    const registerResult = yield userService.registerUser(req.apiContext, req.body);
    return registerResult

  })().then((data) => {
    return responseMethod.sendSuccess(res, null, null, data);
  }, (error) => {
      return responseMethod.sendWrong(res, error);
  });
}


function login(req, res) {
  Promise.coroutine(function* () {
    const loginData = {};
    loginData.email = req.body.email;
    loginData.password = req.body.password;
    loginResult = yield userService.loginViaPassword(req.apiContext, loginData);
    return loginResult;
  })().then((data) => {
    return responseMethod.sendSuccess(res, null, null, data);
  }, (error) => {
    return responseMethod.sendWrong(res, error);
  });
}

