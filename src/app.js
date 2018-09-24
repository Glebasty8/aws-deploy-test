const express = require('express');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const { ServerStyleSheet } = require('styled-components');
const { renderToString } = require('react-dom/server');
const Email = require('email-templates');
const CronJob = require('cron').CronJob;

const middlewares = require('./config/middlewares');

// import App from './client/App';
// const Html = require('./client/Html');
// const email = require('./../emails/email-test.html');

// set express app
const app = express();

// Configure Mongoose
mongoose.connect(process.env.DB_HOST, { useNewUrlParser: true });
mongoose.set('debug', true);
// Configure mongoose's promise to global promise
mongoose.Promise = global.Promise;

// define models
require('./models/Universities');
require('./models/Students');

// adding middlewares
middlewares(app);

require('./config/passport');
app.use(require('./routes'));

const job = new CronJob('0 */10 * * * *', function() {
    const d = new Date();
    console.log('Every Tenth Minute:', d);
});
console.log('After job instantiation');
job.start();

app.get('/', function(req, res) {
    // res.json({ message: 'hooray! welcome to our api!' });
    res.render('index');
    /*const sheet = new ServerStyleSheet();
    const body = renderToString(sheet.collectStyles(<App />));
    const styles = sheet.getStyleTags();
    const title = 'Server side Rendering with Styled Components';

    res.send(
        Html({
            body,
            styles,
            title
        })
    );*/
});

app.get('/email/send', function(req, res) {
    const email = new Email();
    email.render('../emails/email-test.html')
        .then(res => {
            console.log('res', res);
        })
        .catch(err => console.log('err', err))
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.NODE_MAILER_USER,
            pass: process.env.NODE_MAILER_PASSWORD,
        }
    });

    const mailOptions = {
        from: 'gleb.sabakarov1997@gmail.com', // sender address
        to: 'gleb.sabakarov1997@gmail.com', // list of receivers
        subject: 'Subject of your email', // Subject line
        html: `<p>This is body</p>`
    };

    transporter.sendMail(mailOptions, function (err, info) {
        if(err) {
            console.log(err);
        }
        res.json({
            success: true,
            email: 'Email was successfully sent',
        })
    });
});

app.use((err, req, res) => {
    res.status(err.status || 500);

    res.json({
        errors: {
            message: err.message,
            error: {},
        },
    });
});

const server = app.listen(process.env.PORT, () => {
    console.log(`App listening on port ${process.env.PORT}`);
});

//socket.io instantiation
const io = require("socket.io")(server);

//listen on every connection
io.on('connection', (socket) => {
    console.log('New user connected');

    //default username
    socket.username = "Anonymous";

    //listen on change_username
    socket.on('change_username', (data) => {
        socket.username = data.username
    });

    //listen on new_message
    socket.on('new_message', (data) => {
        //broadcast the new message
        io.sockets.emit('new_message', {message : data.message, username : socket.username});
    });

    //listen on typing
    socket.on('typing', (data) => {
        socket.broadcast.emit('typing', {username : socket.username})
    })
});

