const logger = require('morgan');
const path =  require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const rootPath = require('../helpers/index');


module.exports = (app, db) => {
    app.set('views', path.join(rootPath, '/views'));
    // set the view engine to ejs
    app.enable('trust proxy');

    app.use(helmet());
    app.use(cors());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(logger('dev'));
};
