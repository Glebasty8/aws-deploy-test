const express = require('express');
//const mongoose = require('mongoose');

//const router = require('./router');
//const middlewares = require('./config/middlewares');

const app = express();

/**
 * Adding Middleware(s)
 */

// middlewares(app);

app.get('/', function(req, res) {
    res.send('hello world');
});

// app.use('/', router);


app.listen(process.env.PORT, () => {
    console.log(`App listening on port ${process.env.PORT}`);
});

/*mongoose.connect('mongodb://Glebasty1:Borzilololoh123@ds247141.mlab.com:47141/node-tut', { useNewUrlParser: true })
    .then(
        (database) => {
            console.log('database', database);
            app.listen(process.env.PORT, () => {
                console.log(`App listening on port ${process.env.PORT}`);
            });
        },
        err => {
            console.log('err', err);
        }
);*/
