const express = require ('express');
const { check, validationResult } = require('express-validator/check');

const router = express.Router();
const Student = require('../models/student');

router.get('/', (req, res) => {
        Student.find({}, ((err, students) =>  {
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

router.post('/', (req, res) => {
        const student = new Student();      // create a new instance of the Student model
        const { firstName, lastName, age, interests = [], university, email, budget } = req.body;
        student.firstName = firstName;
        student.lastName = lastName;
        student.age = age;
        student.interests = interests;
        student.university = university;
        student.email = email;
        student.budget = budget;

        // save the student and check for errors
        student.save(function(err) {
            if (err)
                res.status(400).send({
                    success: false,
                    err: err
                });

            res.status(200).json({
                success: true,
                data: student
            });
        });
});

router.get('/:id', (req, res) => {
        const studentId = req.params.id;
        Student.findById(studentId, (err, student) => {
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
        Student.findById(studentId)
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
], (req, res) => {
        // Finds the validation errors in this request and wraps them in an object with handy functions
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                success: false,
                errors: errors.array(),
            });
        }
        const studentId = req.params.id;
        Student.findById(studentId, (err, student) => {
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

        const { firstName, lastName, email, age } = req.body;
        const updatedStudent = {
            firstName,
            lastName,
            email,
            age,
        };

        // get the student with that id and update
        Student.findByIdAndUpdate(studentId, updatedStudent, { new: true }, (err, student) => {
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
        Student.findByIdAndUpdate(studentId, {
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

