const User = require('./../models/user');
const service = require('../service');
const presenters = require('../presenters');
const parsers = require('../parsers');

// Logging ====================
const log = require('debug');
const logStream = log('APP:HTTP:MIDDLEWARE:USERS');

// Contents ===================

module.exports.getUserById = (req, res, next) => {
    service.getUserById(req.params.userId)
        .then((user) => {
            res.json(presenters.success(user));
            return next();
        }).catch((err) => {
            logStream(`An error occurred while getting user by id: ${err}`);
            res.json(presenters.fail(err));
        });
};

module.exports.getUsersPage = (req, res, next) => {
    const rawData = {
        page: req.query.page,
        pageSize: req.query.pageSize,
    };
    const parsedData = parsers.parseGetUsersPage(rawData);
    if (Object.keys(parsedData.err).length) {
        logStream(`Wrong query parameters: ${JSON.stringify(parsedData.err)}`);
        res.json(presenters.fail('Wrong query parameters', parsedData.err));
        return;
    }

    service.getUsersPage(parsedData.page, parsedData.pageSize, req.query.orderBy)
        .then((data) => {
            res.json(presenters.success(data));
            return next();
        }).catch((err) => {
            logStream(`An error occurred while getting users page: ${err}`);
            res.json(presenters.fail(err, null));
        });
};

module.exports.getUserByCredentials = (req, res, next) => {
    const parsedData = parsers.parseEmailAndPassword(req.body);
    console.log('!!!!!!!!!!!!!!!!!!!!!!!', parsedData);
    if (Object.keys(parsedData.err).length) {
        logStream(`Wrong user credentials: ${JSON.stringify(parsedData.err)}`);
        res.json(presenters.fail('Wrong user credentials', parsedData.err));
        return;
    }

    service.getUserByCredentials(parsedData.email, parsedData.password)
        .then((data) => {
            res.json(presenters.success(data));
            return next();
        }).catch((err) => {
            logStream(`An error occurred while getting user by credentials: ${err}`);
            res.json(presenters.fail(err, null));
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
        logStream(`Wrong user data: ${JSON.stringify(parsedData.err)}`);
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
