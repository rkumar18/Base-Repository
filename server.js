"use strict"

process.env.NODE_CONFIG_DIR = 'config/';
// Moving NODE_APP_INSTANCE aside during configuration loading
const app_instance = process.argv.NODE_APP_INSTANCE;
process.argv.NODE_APP_INSTANCE = "";
global.config = require('config');
process.argv.NODE_APP_INSTANCE = app_instance;

const express = require('express');

const app = express();

app.set('port', process.env.PORT || config.get('PORT'));
app.use(express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 1000000 }));
app.use(express.json({ limit: '50mb' }));

const swaggerUi = require('swagger-ui-express');
const coreSwaggerDocument = require('./utility/swagger/swagger-core.json');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(coreSwaggerDocument));

app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'Origin,X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});

app.use(function(req,res,next){
    logger.info({ context: "API", msg: req.method + ' ' + req.url });
    next();
});

app.use(function (error, req, res, next) {
    console.log("Error caught in middleware: ", error);
    if (error instanceof SyntaxError) {
        return res.sendStatus(400);
    }
    next();
});

global.app = app;

const startupService = require('./lib/init');
startupService.initializeServer();



