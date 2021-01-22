
const mongoLib = require('../../../lib/database/services/mongoService');
const responseMethod = require('../../../lib/methods/responseMethods');

const CONTEXT = "auth";

exports.validateUserToken = validateUserToken;

function validateUserToken(req, res, next) {
    Promise.coroutine(function* () {
        const apiContext = {
            context: CONTEXT,
            event: "validateUserToken",
            silent: true
        };
        if (req.body && (req.body.access_token || req.body.user_id)) {
            const criteria = {}
            if (req.body.access_token) {
                criteria.access_token = req.body.access_token;
            }
            if (req.body.user_id) {
                criteria.user_id = req.body.user_id;
            }
            const result = yield mongoLib.findOne(apiContext, config.get("mongoDbCollections.Users"), criteria);
            if (!result || !result.user_id) {
                return responseMethod.sendError(res, "INVALID ACCESS TOKEN");
            }
            if (!result.is_active) {
                return responseMethod.sendError(res, "ACCOUNT NOT ACTIVE");
            }
            if (result.is_deleted) {
                return responseMethod.sendError(res, "DELETED ACCOUNT");
            }
            return next();
        }
        return next();

    })().catch((error) => {
        responseMethod.sendWrong(res, error);
    });
}

