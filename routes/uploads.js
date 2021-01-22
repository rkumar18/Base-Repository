const express = require('express');
const uploadRouter = express.Router();
const middleware = require('../middleware');
const uploadController = require('../controllers/uploadController');
const multer = require('multer')
const upload = multer({dest: "public/uploads/"})

uploadRouter.post('/uploadProfile', upload.single("photo"), uploadController.uploadProfile);
uploadRouter.post('/uploadFile', middleware.verifyToken, upload.single("file"), uploadController.uploadFile);


exports.uploadRouter = uploadRouter;
