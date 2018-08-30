const express = require ('express');

const router = express.Router();
const Comment = require('../models/сomment');

router.get('/comments', (req, res) => {
        Comment.find({}, ((err, comments) =>  {
            console.log('res', res);
            if(err) {
                res.status(400).json({
                    success: false,
                    err: err,
                })
            }
            res.status(200).json({
                success: true,
                data: comments
            })
        }))
    });

router.post('/comments', (req, res) => {
        const comment = new Comment();
        const { author, body} = req.body;
        comment.author = author;
        comment.body = body;

        // save the student and check for errors
        comment.save(function(err) {
            if (err)
                res.status(400).send({
                    success: false,
                    err: err
                });

            res.status(200).json({
                success: true,
                data: comment
            });
        });
    });

module.exports = router;

