const ApiController = require('./api');

class AuthController extends ApiController {
    constructor(router) {
        super(router, 'auth');
    }

    link(router) {
        router.get(`${this.prefix}/test`, this.test);
    }

    test(req, res) {
        res.send('Hello')
    }

}

module.exports = AuthController;
