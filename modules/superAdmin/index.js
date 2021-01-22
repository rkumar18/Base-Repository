


const express = require('express');
const superAdminRouter = express.Router();

const superAdminController     = require('./controllers/superAdminController');


superAdminRouter.post('/login', superAdminController.login);

exports.superAdminRouter = superAdminRouter;