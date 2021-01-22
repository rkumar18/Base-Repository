const express = require('express');
const retailerRouter = express.Router();
const middleware = require('../middleware');
const retailerController = require('../controllers/retailerController');


//Retailer Onboarding APIs
retailerRouter.post('/register', retailerController.register);
retailerRouter.post('/login', retailerController.login);
retailerRouter.post('/forgotPassword', retailerController.forgotPassword);
retailerRouter.get('/checkForgotPassword/:id', retailerController.checkPasswordResetLink);
retailerRouter.post('/resetPassword', retailerController.resetPassword);
retailerRouter.post('/editProfile', middleware.verifyToken, retailerController.editProfile);
retailerRouter.post('/logout', middleware.verifyToken, retailerController.logout);

exports.retailerRouter = retailerRouter;