const { Router } = require('express');
const controllers = require('./controllers');

const router = Router();

controllers(router);

module.exports = router;
