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
//CMS Management APIs
adminRouter.post('/addCms', middleware.verifyToken, adminController.addCms);
adminRouter.get('/getCms', middleware.verifyToken, adminController.getCms);
//Retailer Management APIs
adminRouter.post('/getRetailer', middleware.verifyToken, adminController.getRetailer);
adminRouter.put('/updateRetailerDetails', middleware.verifyToken, adminController.updateRetailerDetails);
adminRouter.post('/getRetailerById', middleware.verifyToken, adminController.getRetailerById);
//Category Management APIs
adminRouter.post('/addCategory', middleware.verifyToken, adminController.addCategory);
adminRouter.post('/getAllCategory', middleware.verifyToken, adminController.getAllCategory);
adminRouter.put('/updateCategory', middleware.verifyToken, adminController.updateCategory);
adminRouter.post('/getCategoryById', middleware.verifyToken, adminController.getCategoryById);
//Inventory Manangement APIs
adminRouter.post('/addProduct', middleware.verifyToken, adminController.addProduct);
adminRouter.post('/getAllProduct', middleware.verifyToken, adminController.getAllProduct);
adminRouter.post('/updateProduct', middleware.verifyToken, adminController.updateProduct);
adminRouter.post('/getProductById', middleware.verifyToken, adminController.getProductById);
//Supplier Manangement APIs
adminRouter.post('/addSupplier', middleware.verifyToken, adminController.addSupplier);
adminRouter.post('/getAllSupplier', middleware.verifyToken, adminController.getAllSupplier);
adminRouter.put('/updateSupplierDetails', middleware.verifyToken, adminController.updateSupplierDetails);
adminRouter.post('/getSupplierById', middleware.verifyToken, adminController.getSupplierById);

adminRouter.post('/getRestaurantOrderCsv', middleware.verifyToken, adminController.getRestaurantOrderCsv);
adminRouter.post('/getOrderCsv', middleware.verifyToken, adminController.getOrderCsv);
exports.adminRouter = adminRouter;
