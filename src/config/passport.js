const passport = require('passport');
const LocalStrategy = require('passport-local');

const Students = require('./../models/Students');

passport.use(new LocalStrategy({
    usernameField: 'student[email]',
    passwordField: 'student[password]',
}, (email, password, done) => {
    Students.findOne({ email })
        .then((student) => {
            if(!student || !student.validatePassword(password)) {
                return done(null, false, { errors: { 'email or password': 'is invalid' } });
            }

            return done(null, student);
        }).catch(done);
}));
