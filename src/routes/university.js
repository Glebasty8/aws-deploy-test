const express = require ('express');
const { check, validationResult } = require('express-validator/check');

const router = express.Router();
const University = require('../models/university');

router.get('/', (req, res) => {
    University.find({}, ((err, universities) =>  {
        console.log('res', res);
        if(err) {
            res.status(400).json({
                success: false,
                err: err,
            })
        }
        res.status(200).json({
            success: true,
            data: universities
        })
    }))
});

router.post('/', [
    // username must be an email
    check('title').exists({ checkFalsy: true }),
    check('type').exists({ checkFalsy: true }),
], (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            success: false,
            errors: errors.array(),
        });
    }
    const university = new University();
    const { title, type } = req.body;
    university.title = title;
    university.type = type;

    // save the student and check for errors
    university.save(function(err) {
        if (err)
            res.status(400).send({
                success: false,
                err: err
            });

        res.status(200).json({
            success: true,
            data: university
        });
    });
});

module.exports = router;

