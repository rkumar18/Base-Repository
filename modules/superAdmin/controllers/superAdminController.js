

let superAdminService = require('../services/superAdminService');
const responseMethod = require('../../../lib/methods/responseMethods');

exports.login = login;

function login(req, res) {
  Promise.coroutine(function* () {
    const loginData = {};
    loginData.email = req.body.email;
    loginData.password = req.body.password;
    loginResult = yield superAdminService.loginViaPassword(req.apiContext, loginData);
    return loginResult;
  })().then((data) => {
    return responseMethod.sendSuccess(res, null, null, data);
  }, (error) => {
    return responseMethod.sendWrong(res, error);
  });
}

