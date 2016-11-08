const crypto = require('crypto');
const User = require('../models/user');
const ServiceError = require('../error');
const uuid = require('uuid');
const constants = require('../constants');


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

module.exports.createUser = (firstName, lastName, email, password) => {
    const userData = {
        first_name: firstName,
        last_name: lastName,
        email: email,
        status: constants.userStatuses.active,
    };
    return new User({email: email}).fetch()
        .then((user) => {
            if (user && !user.deleted_at) {
                throw new ServiceError('User with this email already exists');
            }
            userData.deleted_at = null;
            userData.updated_at = userData.created_at = Date.now();
            return hashPassword(password);
        })
        .then((hashedPass) => {
            userData.password = hashedPass;
            return new User(userData).save();
        });
};


module.exports.markAsDeleted = userId => (
    new User({id: userId}).fetch()
        .then((user) => {
            if (!user) {
                throw new ServiceError(`User with id '${userId}' is not found`);
            }
            return new User({id: userId})
                .save({deleted_at: new Date()});
        })
);
