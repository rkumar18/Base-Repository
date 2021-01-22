const jwt = require('jsonwebtoken');
const response = require('./lib/constants/responses');
const constants = require('./lib/constants/constants');
const Models = require('./models/index');

let verifyToken = (req, res, next) => {
  let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
  if (token) {
    if (token.startsWith('Bearer ')) {
      // Remove Bearer from string
      token = token.slice(7, token.length);
    }
    jwt.verify(token, config.get('JWT_SERVICE.jwt_secret'), (err, decoded) => {
      if (err) {
        return res.json({
          success: false,
          message: response.responseMessages.INVALID_TOKEN
        });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.json({
      success: false,
      message: response.responseMessages.TOKEN_MISSING
    });
  }
};

module.exports = {
  verifyToken: verifyToken}


