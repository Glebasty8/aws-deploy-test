const logger = require('morgan');
const path =  require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const fileUpload = require('express-fileupload');
const rootPath = require('../helpers/index');


module.exports = (app) => {
    app.set('views', path.join(rootPath, '/views'));
    // set the view engine to ejs
    app.enable('trust proxy');

    app.use(helmet());
    app.use(cors());
    app.use(fileUpload());
    // app.use(bodyParser.json({ limit: '50mb' }));
    // app.use(bodyParser.urlencoded({ extended: true, limit:'50mb' }));
    app.use(logger('dev'));
};
