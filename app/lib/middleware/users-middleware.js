const User = require('./../models/user');
const service = require('../service');
const presenters = require('../presenters');

// Logging ====================
const log = require('debug');
const logStream = log('APP:HTTP:MIDDLEWARE:BOOKS');

// Contents ===================
module.exports.getUsers = (req, res, next) => {
    User.fetchAll().then((users) => {
        res.data = users;
        return next();
    });
};

module.exports.createUser = (req, res, next) => {
    service.createUser(req.body.firstName, req.body.lastName, req.body.email, req.body.password).then((user) => {
        console.log(user);
        res.json(presenters.success(user));
        return next();
    }).catch((err) => {
        res.json(presenters.fail(err, null));
    });
};
