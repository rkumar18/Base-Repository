let uploadServices = require('../services/uploadServices');
const responseMethod = require('../lib/constants/responses');

exports.uploadProfile = uploadProfile;
exports.uploadFile = uploadFile;

function uploadProfile(req, res) {
  Promise.coroutine(function* () {
    req.body.photo = req.file;  
    const link = yield uploadServices.uploadProfile(req.body);
    return link
  })().then((data) => {
    return responseMethod.sendSuccess(res, null, null, data);
  }, (error) => {
    return responseMethod.sendFailure(res, error);
  });
}
function uploadFile(req, res) {
  Promise.coroutine(function* () {
    req.body.file = req.file;  
    const jwtDecodedData = req.decoded;
    const link = yield uploadServices.uploadFile(req.body, jwtDecodedData);
    return link
  })().then((data) => {
    return responseMethod.sendSuccess(res, null, null, data);
  }, (error) => {
    return responseMethod.sendFailure(res, error);
  });
}
