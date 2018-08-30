const express = require('express');
const S3 = require('aws-sdk/clients/s3');
const mongoose = require('mongoose').set('debug', true);

// const router = require('./router');
const router = express.Router(); // get an instance of the express Router
const middlewares = require('./config/middlewares');
const fileUpload = require('./services/s3');

// set express app
const app = express();

mongoose.connect(process.env.DB_HOST, { useNewUrlParser: true });
mongoose.Promise = global.Promise;

/**
 * Adding Middleware(s)
 */

middlewares(app);

app.post('/upload', async (req, res) => {
    console.log('req.body', req.body);
    if (!req.files)
        return res.status(400).send('No files were uploaded.');

    const avatar = req.files.avatar;
    let s3bucket = new S3({
        accessKeyId: process.env.ACCESS_KEY_ID,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
        Bucket: process.env.BUCKET,
    });
    const params = {
        Bucket: process.env.BUCKET,
        Key: avatar.name,
        Body: avatar.data,
    };
    const fileData = await s3bucket.upload(params).promise();
    console.log('fileData', fileData);
    return res.json({
        success: true,
        data: fileData,
    })
});

app.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});


// initialize universities routes
app.use('/api/universities', require('./routes/university'));

// initialize students routes
app.use('/api/students', require('./routes/student'));

// initialize comments routes
app.use('/api/comments', require('./routes/comment'));



app.listen(process.env.PORT, () => {
    console.log(`App listening on port ${process.env.PORT}`);
});


