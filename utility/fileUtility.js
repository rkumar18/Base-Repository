

var fs                                          = require('fs');

var logging                                     = require('../logging/logging');

exports.readDir                                  = readDir;
exports.readFile                                 = readFile;

function readDir(apiContext, opts) {
  return new Promise((resolve, reject) => {
    fs.readdir(opts.dirNamePath, function (err, filenames) {
      if (err) {
        return reject();
      }
      logging.log(apiContext, {FILENAMES: filenames});
      return resolve(filenames);
    });
  });
}

function readFile(apiContext, opts) {
  return new Promise((resolve, reject) => {
    fs.readFile(opts.path, function (error, filename) {
      if (error) {
        return reject();
      }
      logging.log(apiContext, {FILENAME: filename});
      return resolve(filename);
    });
  });
}