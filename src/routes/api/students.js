const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const S3 = require('aws-sdk/clients/s3');
const { check, validationResult } = require('express-validator/check');

const router = express.Router();
const auth = require('../auth');
const Students = mongoose.model('Students');

router.get('/', auth.optional, (req, res) => {
        Students.find({}, ((err, students) =>  {
            console.log('res', res);
            if(err) {
                res.status(400).json({
                    success: false,
                    err: err,
                })
            }
            res.status(200).json({
                success: true,
                data: students
            })
        }))
});

router.post('/', auth.optional, (req, res) => {
    const student = new Students();      // create a new instance of the Student model
    const { firstName, lastName, age, interests = [], university, email, budget, password } = req.body;
    student.firstName = firstName;
    student.lastName = lastName;
    student.age = age;
    student.interests = interests;
    student.university = university;
    student.email = email;
    student.budget = budget;
    student.setPassword(password);

    student.save()
       .then(() => {
           res.status(200).json({
               success: true,
               data: student.toAuthJSON()
           })
       })
       .catch(err => console.log('error', err))
});

//POST login route (optional, everyone has access)
router.post('/login', [
    // username must be an email
    check('email').exists({ checkFalsy: true }),
    check('password').exists({ checkFalsy: true }),
], auth.optional, (req, res, next) => {
    const { body: { email, password } } = req;
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            success: false,
            errors: errors.array(),
        });
    }
    return passport.authenticate('local', { session: false }, (err, passportStudent, info) => {
        if(err) {
            return next(err);
        }

        if(passportStudent) {
            const student = passportStudent;
            student.token = passportStudent.generateJWT();

            return res.json({ user: student.toAuthJSON() });
        }

        return status(400).info;
    })(req, res, next);
});

//GET current route (required, only authenticated users have access)
router.get('/current', auth.required, (req, res, next) => {
    const { payload: { id } } = req;
    console.log('req payload', req.payload);

    return Students.findById(id)
        .then((student) => {
            if(!student) {
                return res.sendStatus(400);
            }

            return res.json({ student: student.toAuthJSON() });
        });
});

router.get('/:id', (req, res) => {
        const studentId = req.params.id;
        Students.findById(studentId, (err, student) => {
            if (err) return res.status(400).json({
                success: false, error: err
            });
            if (student.deletedAt) {
                return res.status(400).json({
                    success: false,
                    error: 'User doesn`t exist.',
                })
            }
        });
        Students.findById(studentId)
            .populate('university')
            .exec((err, student) => {
                if (err)
                    res.status(400).send({
                        success: false,
                        error: err,
                    });

                res.json({
                    success: true,
                    data: student,
                });
            });
});

router.put('/:id', [
    // username must be an email
    check('firstName').exists({ checkFalsy: true }),
    check('lastName').exists(),
    check('email').isEmail(),
    check('age').exists(),
], async (req, res) => {
        // Finds the validation errors in this request and wraps them in an object with handy functions
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                success: false,
                errors: errors.array(),
            });
        }
        const studentId = req.params.id;
        Students.findById(studentId, (err, student) => {
            if (err) return res.status(400).json({
                success: false, error: err
            });
            if (student.deletedAt) {
                return res.status(400).json({
                    success: false,
                    error: 'User doesn`t exist.',
                })
            }
        });
    if (!req.files)
        return res.status(400).send('No files were uploaded.');

    const avatar = req.files.avatar;
    let s3bucket = new S3({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        Bucket: process.env.AWS_S3_BUCKET,
    });
    const params = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: avatar.name,
        Body: avatar.data,
        ACL: 'public-read',
    };
    const fileData = await s3bucket.upload(params).promise();
    const uploadedImageUrl = fileData.Location;
    console.log('fileData', fileData);
    console.log('uploadedImageUrl', uploadedImageUrl);
    /*res.json({
        success: true,
        data: fileData,
    });*/

        const { firstName, lastName, email, age } = req.body;
        const updatedStudent = {
            firstName,
            lastName,
            email,
            age,
            img: uploadedImageUrl,
        };

        // get the student with that id and update
        Students.findByIdAndUpdate(studentId, updatedStudent, { new: true }, (err, student) => {
            if(err) {
                res.status(400).send({
                    success: false,
                    error: err,
                });
            }
            res.json({
                success: true,
                data: student,
            })
        })
});

router.delete('/:id', (req, res) => {
        const studentId = req.params.id;
        Students.findByIdAndUpdate(studentId, {
            deletedAt: new Date(),
        }, { new: true }, (err, student) => {
            if(err) {
                res.status(400).send({
                    success: false,
                    error: err,
                });
            }
            res.json({
                success: true,
                data: student,
            })
        })
});

module.exports = router;

