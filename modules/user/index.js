


const express = require('express');
const userRouter = express.Router();

const userController     = require('./controllers/userController');




userRouter.post('/sign-up', userController.signUp);

userRouter.post('/login', userController.login);

exports.userRouter = userRouter;