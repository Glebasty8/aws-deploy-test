const controllers = [
    require('./auth'),
];

module.exports = (router) => {
    return controllers.map((controller) => {
        return new controller(router);
    })
};
