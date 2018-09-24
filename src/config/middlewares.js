const express = require('express');
const logger = require('morgan');
const path =  require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const fileUpload = require('express-fileupload');
const session = require('express-session');

const rootPath = require('./../helpers');

module.exports = (app) => {
    app.set('views', path.join(rootPath,'/views'));

    //set the template engine ejs
    app.set('view engine', 'ejs');

    // set the view engine to ejs
    app.enable('trust proxy');
    app.use(helmet());
    app.use(cors());
    app.use(express.static(path.join(rootPath, 'public')));
    app.use(fileUpload());
    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(bodyParser.urlencoded({ extended: true, limit:'50mb' }));
    app.use(logger('dev'));
    app.use(session({ secret: 'passport-tutorial', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false }));
};
