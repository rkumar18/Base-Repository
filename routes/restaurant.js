const express = require('express');
const adminRouter = express.Router();
const middleware = require('../middleware');
const restaurantController = require('../controllers/restaurantController');
const multer = require('multer')
const upload = multer({ dest: "public/uploads/" })

//Admin Onboarding APIs
restaurantRouter.post('/register', restaurantController.register);
restaurantRouter.post('/login', restaurantController.login);
restaurantRouter.post('/forgotPassword', restaurantController.forgotPassword);
restaurantRouter.get('/checkForgotPassword/:id', restaurantController.checkPasswordResetLink);
restaurantRouter.post('/resetPassword', restaurantController.resetPassword);
//Admin Profile Management APIs
restaurantRouter.post('/changePassword', middleware.verifyToken, restaurantController.changePassword);
restaurantRouter.get('/getProfile', middleware.verifyToken, restaurantController.getProfile);
restaurantRouter.put('/editProfile', middleware.verifyToken, restaurantController.editProfile);

exports.restaurantRouter = restaurantRouter;
