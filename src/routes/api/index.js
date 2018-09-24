const express = require('express');
const router = express.Router();

// initialize universities routes
router.use('/universities', require('./universities'));

// initialize students routes
router.use('/students', require('./students'));

// initialize comments routes
router.use('/students', require('./students'));

module.exports = router;
