const BasicController = require('./basic');

class ApiController extends BasicController {
    constructor(router, prefix) {
        super(router, `/api/${prefix}`);
    }
}

module.exports = ApiController;
