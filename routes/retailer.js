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
//Retailer Profile Management APIs
retailerRouter.post('/changePassword', middleware.verifyToken, retailerController.changePassword);

retailerRouter.post('/addItem', middleware.verifyToken, retailerController.addItem);
retailerRouter.post('/updateItem', middleware.verifyToken, retailerController.updateItem);
retailerRouter.post('/getItems', middleware.verifyToken, retailerController.getItems);
retailerRouter.post('/getItemById', middleware.verifyToken, retailerController.getItemById);

retailerRouter.post('/createOrder', middleware.verifyToken, retailerController.createOrder);
retailerRouter.post('/updateOrder', middleware.verifyToken, retailerController.updateOrder);
retailerRouter.post('/getOrders', middleware.verifyToken, retailerController.getOrders);

retailerRouter.post('/getUserDetail', middleware.verifyToken, retailerController.getUserDetail);

retailerRouter.post('/earningDashboard', middleware.verifyToken, retailerController.earningDashboard);

exports.retailerRouter = retailerRouter;