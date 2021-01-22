

const authController = require('../../auth/controllers/authController');
const twilioService = require('../../../utility/sms-services/twilioServices');
// const nodeMailerService = require('../../../utility/email-services/nodeMailerService');

exports.registerUser = registerUser;
exports.loginViaPassword = loginViaPassword;
// exports.loginViaAccessToken = loginViaAccessToken;



function registerUser(apiContext, registerData) {
    return new Promise((resolve, reject) => {
        Promise.coroutine(function* () {

            logger.info({ context: "Register ", event: "insertUserData", msg: registerData });
            
            const userData = yield authController.createUser(apiContext, registerData);
            if (!userData.status) {
                reject(userData.reason);
            }
            return resolve(userData.data);
        })();
    });
}

// function loginViaAccessToken(apiContext, loginData) {
//     return new Promise((resolve, reject) => {
//         Promise.coroutine(function* () {
//             if (loginData.access_token) {
//                 let userDetails = yield authController.getUserDetails(apiContext, { access_token: loginData.access_token });
//                 if (!userDetails.status || !userDetails.data) {
//                     return reject(userDetails.reason);
//                 }
//                 userDetails = userDetails.data
//                 const loginDetails = yield authController.initiateUserLogin(apiContext, { user_id: userDetails.user_id });
//                 if (!loginDetails.status) {
//                     return reject(loginDetails.reason);
//                 }
//                 delete userDetails.password;
//                 delete userDetails._id;
//                 userDetails.access_token = loginDetails.access_token;
//                 return resolve(userDetails);
//             }
//             return reject("INVALID REQUEST");
//         })();
//     });
// }

function loginViaPassword(apiContext, loginData) {
    return new Promise((resolve, reject) => {
        Promise.coroutine(function* () {

            if (loginData.email && loginData.password) {
                let userDetails = yield authController.getUserDetails(apiContext, 
                {
                    email: loginData.email
                });
                if (!userDetails.status || !userDetails.data) {
                    return reject(userDetails.reason);
                }
                userDetails = userDetails.data
                const userWithPassword = yield authController.getUserDetails(apiContext, 
                {
                    user_id: userDetails.user_id,
                    password: loginData.password
                });
                if (!userWithPassword.status) {
                    return reject("INCORRECT PASSWORD");
                }
                const loginDetails = yield authController.initiateUserLogin(apiContext, { user_id: userDetails.user_id });

                if (!loginDetails.status) {
                    return reject(loginDetails.reason);
                }
                userDetails.access_token = loginDetails.access_token;
                return resolve(userDetails);
            }
            return reject("INVALID REQUEST");

        })();
    });
}
