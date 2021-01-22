const express = require('express');
const adminRouter = express.Router();
const middleware = require('../middleware');
const adminController = require('../controllers/adminController');
const multer = require('multer')
const upload = multer({ dest: "public/uploads/" })

//Admin Onboarding APIs
adminRouter.post('/register', adminController.register);
adminRouter.post('/login', adminController.login);
adminRouter.post('/forgotPassword', adminController.forgotPassword);
adminRouter.get('/checkForgotPassword/:id', adminController.checkPasswordResetLink);
adminRouter.post('/resetPassword', adminController.resetPassword);
//Admin Profile Management APIs
adminRouter.post('/changePassword', middleware.verifyToken, adminController.changePassword);
adminRouter.get('/getProfile', middleware.verifyToken, adminController.getProfile);
adminRouter.put('/editProfile', middleware.verifyToken, adminController.editProfile);

exports.adminRouter = adminRouter;
