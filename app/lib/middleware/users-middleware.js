const User = require('./../models/user');
const service = require('../service');
const presenters = require('../presenters');
const parsers = require('../parsers');

// Logging ====================
const log = require('debug');
const logStream = log('APP:HTTP:MIDDLEWARE:USERS');

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
        logStream(`An error occurred while create user: ${err}`);
        res.json(presenters.fail(err, null));
    });
};

module.exports.deleteUser = (req, res, next) => {
    service.markAsDeleted(req.params.userId)
        .then((deletedUser) => {
            res.json(presenters.success(deletedUser));
            return next();
        }).catch((err) => {
            logStream(`An error occurred while deleting user: ${err}`);
            res.json(presenters.fail(err, null));
        });
};

module.exports.updateUser = (req, res, next) => {
    const parsedData = parsers.parseUpdateUser(req.body);
    if (Object.keys(parsedData.err).length) {
        logStream(`Wrong user data: ${parsedData.err}`);
        res.json(presenters.fail('Wrong user data', parsedData.err));
        return;
    }
    service.updateUser(req.params.userId, req.body)
        .then((updatedUser) => {
            res.json(presenters.success(updatedUser));
            return next();
        }).catch((err) => {
            logStream(`An error occurred while updating user: ${err}`);
            res.json(presenters.fail(err, null));
        });
};
