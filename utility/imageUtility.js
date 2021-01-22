

var logging                                     = require('../logging/logging');
var commonFunction                              = require('../routes/commonfunction');

exports.uploadImageToS3Bucket                   = uploadImageToS3Bucket;

function uploadImageToS3Bucket(apiContext, opts) {
  return new Promise((resolve, reject) => {
    commonFunction.uploadImageToS3Bucket(opts.file, opts.folder, function(data){
      if(data == 0){
        return reject("Unable to upload image");
      }
      return resolve(opts.s3BaseUrl + '/' + opts.folder + '/' + data);
    }, opts.user_id, apiContext);
  });
}