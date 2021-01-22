

function sendHttpRequest(apiContext, options) {
    return new Promise((resolve, reject) => {
        options.gzip = true;
        logging.log(apiContext, { HTTP_REQUEST: options });
        options.json.auth_key = config.get("authSuperSecretKey");
        options.json.offering = options.json.offering || 1;
        request(options, (error, response, body) => {
            if (error) {
                logging.logError(apiContext, {
                    EVENT: 'Error from external server', OPTIONS: options, ERROR: error,
                    RESPONSE: response, BODY: body
                }
                );
                if (!apiContext || _.isEmpty(apiContext)) {
                    console.log(error, body, "error response from auth server");
                }
                return reject(error);
            }
            if (response == undefined) {
                error = new Error('No response from external server');
                return reject(error);
            }
            if (response.statusCode < '200' || response.statusCode > '299') {
                error = new Error('Couldn\'t request with external server ');
                error.code = response.statusCode;
                logging.logError(apiContext, {
                    EVENT: 'Error from external server', OPTIONS: options, ERROR: error,
                    RESPONSE: response, BODY: body
                }
                );
                return reject(body || error);
            }
            logging.log(apiContext, {
                EVENT: 'Response from external server', OPTIONS: options, ERROR: error,
                RESPONSE: response, BODY: body
            }
            );

            if (body && body.status != constants.responseFlags.ACTION_COMPLETE) {
                if (!apiContext || _.isEmpty(apiContext)) {
                    console.log(body, "error response from auth server");
                }
                return reject(error);
            }
            return resolve(body);
        });
    });
}

function sendHttpRequestToExternalServer(apiContext, opts) {
    var options = opts.options;
    return new Promise((resolve, reject) => {
        logging.log(apiContext, { HTTP_REQUEST: options });

        request(options, (error, response, body) => {
            if (error) {
                logging.logError(apiContext, {
                    EVENT: 'Error from external server', OPTIONS: options, ERROR: error,
                    RESPONSE: response, BODY: body
                }
                );
                if (!apiContext || _.isEmpty(apiContext)) {
                    console.error(error, body, "error response from external server");
                }
                return reject(error);
            }
            if (response == undefined) {
                error = new Error('No response from external server');
                return reject(error);
            }
            if (response.statusCode < '200' || response.statusCode > '299') {
                error = new Error('Couldn\'t request with external server ');
                error.code = response.statusCode;
                logging.logError(apiContext, {
                    EVENT: 'Error from external server', OPTIONS: options, ERROR: error,
                    RESPONSE: response, BODY: body
                }
                );
                return reject(body || error);
            }
            logging.log(apiContext, {
                EVENT: 'Response from external server', OPTIONS: options, ERROR: error,
                RESPONSE: response, BODY: body
            }
            );
            return resolve(body);
        });
    });
}