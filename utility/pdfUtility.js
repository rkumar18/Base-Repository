

var pdf                                         = require('phantom-html2pdf');
var logging                                     = require('../logging/logging');

exports.convert                                 = convert;

function convert(apiContext, opts) {
  return new Promise((resolve, reject) => {
    pdf.convert(opts, function (err, result) {
      /* Using the temp file path */
      if (err || !result) {
        return reject();
      }
      return resolve(result);
    });
  });
}