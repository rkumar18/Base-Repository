const responses = require('../lib/constants/responses');
const commonFunction = require('../commonFunction');
const Models = require('../models/index');
const JwtService = require('../services/jwtServices');
const md5 = require('md5');
const moment = require('moment');
const path = require('path');
const fileUploadServices = require('../services/fileUploadServices');

exports.uploadProfile = uploadProfile;
exports.uploadFile = uploadFile;

function uploadProfile(uploadData) { 
    return new Promise((resolve, reject) => {
        Promise.coroutine(function* () {
            const photo = uploadData.photo;
            const user = uploadData.userId || "";
            const manValues = [photo];
            if (commonFunction.checkBlank(manValues)) {
                return reject(responses.responseMessages.PARAMETER_MISSING)
            }
            logger.info({ context: "Upload Profile ", event: "uploadProfile", msg: uploadData });
            const links3 = yield fileUploadServices.readFileToUpload(photo);

            let fileObject = {
                photo: links3,
                user: user || ""
            }
            const fileDetails = yield Models.UploadModel.create(fileObject)
            fileDetails.save().then(saveresult => {
                return resolve({id: saveresult._id, linkS3: saveresult.photo})
            }).catch(error => {
                if (error.errors)
                    return reject(commonFunction.handleValidation(error))
                return reject(error)
            })
        })();
    });
}
function uploadFile(uploadData, jwtDecodedData) { 
    return new Promise((resolve, reject) => {
        Promise.coroutine(function* () {
            const file = uploadData.file;
            const user = jwtDecodedData._id;
            const manValues = [file, user];
            if (commonFunction.checkBlank(manValues)) {
                return reject(responses.responseMessages.PARAMETER_MISSING)
            }
            logger.info({ context: "Upload Document ", event: "upload file", msg: uploadData });
            const links3 = yield fileUploadServices.readFileToUpload(file);

            let fileObject = {
                photo: links3,
                user: user
            }
            const fileDetails = yield Models.UploadModel.create(fileObject)
            fileDetails.save().then(saveresult => {
                return resolve({id: saveresult._id, linkS3: saveresult.photo})
            }).catch(error => {
                if (error.errors)
                    return reject(commonFunction.handleValidation(error))
                return reject(error)
            })
        })();
    });
}
