


const express = require('express');
const authRouter = express.Router();

const authController = require('./controllers/authController');

// authRouter.post('/administrator');

exports.authRouter = authRouter;