const crypto = require('crypto');
const User = require('../models/user');
const ServiceError = require('../error');
const constants = require('../constants');
const bookshelf = require('../database');


const hashPassword = (password) => {
    return new Promise((resolve, reject) => {
        const salt = crypto.randomBytes(10).toString('base64');

        crypto.pbkdf2(password, salt, 100, 60, 'sha512', (err, key) => {
            if (err) reject(err);

            // function:algorithm:iterations:salt:key(hex)
            const hashedPassword = `PBKDF2:sha512:100:${salt}:${key.toString('hex')}`;
            resolve(hashedPassword);
        });
    });
};

const comparePassword = (password, hashedPassword) => {
    if (!password) throw new Error('USER_MISSING_CREDENTIALS');

    return new Promise((resolve, reject) => {
        // pbkdf2 is prefixd PBKDF2:sha512:[i]:salt:password
        const parsed = hashedPassword.split(':');
        const hash = {
            iterations: parsed[2],
            salt: parsed[3],
            hash: parsed[4],
        };

        crypto.pbkdf2(password, hash.salt, parseInt(hash.iterations), 60, 'sha512', (err, key) => {
            if (err) return reject(err);
            if (hash.hash !== key.toString('hex')) return reject('AUTH_PASSWORD_INCORRECT');

            return resolve(true);
        });
    });
};

const createUser = (userData, transaction = undefined) => {
    const buildUser = Object.assign(userData, {
        status: constants.userStatuses.active,
    });
    delete buildUser.err;
    return new User({email: userData.email}).fetch()
        .then((user) => {
            if (user) {
                if (!user.attributes.deletedAt) {
                    throw new ServiceError('User with this email already exists');
                }
                buildUser.id = user.attributes.id;
            }
            buildUser.deletedAt = null;
            buildUser.createdAt = new Date();
            return hashPassword(userData.password);
        })
        .then((hashedPass) => {
            buildUser.password = hashedPass;
            return new User(buildUser).save({transacting: transaction});
        });
};

module.exports.createUser = createUser;

module.exports.getUserById = userId => (
    new User({id: userId}).fetch()
        .then((user) => {
            if (!user) {
                throw new ServiceError(`User with id '${userId}' is not found`);
            }
            return new Promise((resolve) => {
                resolve(user);
            });
        })
);

module.exports.getUsersPage = (page, pageSize, orderBy) => (
    new User()
        .orderBy(constants.orderUserBy[orderBy] || constants.orderUserBy.lastName)
        .fetchPage({
            pageSize,
            page,
        }).then(usersPage => (
            new Promise((resolve) => {
                resolve({
                    users: usersPage,
                    count: usersPage.pagination.rowCount,
                    page,
                    pageSize,
                    orderBy,
                });
            })
    ))
);

module.exports.getUserByCredentials = (email, password) => {
    let user;
    return new User({
        email,
    }).fetch().then((dbUser) => {
        if (!dbUser) {
            throw new ServiceError('Wrong pair email/password');
        }
        user = dbUser;
        return comparePassword(password, user.attributes.password);
    }).then(isMatch => (
        new Promise((resolve, reject) => {
            if (isMatch) {
                resolve(user);
            }
            reject(new ServiceError('Wrong pair email/password'));
        })
    ));
};

module.exports.importUsers = (users) => {
    const emails = users.map(user => user.email);
    const usersAlreadyExist = [];
    return new User().where('email', 'in', emails).fetchAll()
        .then((usersData) => {
            const deletedUsers = [];
            const existingUserEmails = usersData.map((user) => {
                if (user.attributes.deletedAt) {
                    deletedUsers.push(user);
                }
                usersAlreadyExist.push({
                    error: 'User already exists',
                    user,
                });
                return user.attributes.email;
            });
            const noUsers = users.filter(user => existingUserEmails.indexOf(user.email) === -1);
            return bookshelf.transaction((t) => {
                const promises = [];
                noUsers.forEach((user) => {
                    promises.push(new User(Object.assign(user, {
                        status: constants.userStatuses.active,
                    })).save(null, {transacting: t}));
                });
                deletedUsers.forEach((user) => {
                    promises.push(new User(Object.assign(user.attributes, {
                        status: constants.userStatuses.active,
                        deletedAt: null,
                        createdAt: new Date(),
                    })).save(null, {transacting: t}));
                });
                return Promise.all(promises);
            });
        })
        .then((createdUsers) => {
            return new Promise((resolve) => {
                resolve({
                    fail: usersAlreadyExist,
                    users: createdUsers.map(user => {
                        delete user.attributes.updated_at;
                        return user;
                    }),
                });
            });
        });
};

module.exports.markAsDeleted = userId => (
    new User({id: userId}).fetch()
        .then((user) => {
            if (!user) {
                throw new ServiceError(`User with id '${userId}' is not found`);
            }
            return new User({id: userId})
                .save({deletedAt: new Date()});
        })
);

module.exports.updateUser = (userId, userData) => (
    new User({id: userId}).save(userData)
);
