const constants = require('../constants');


module.exports.parseUpdateUser = (data) => {
    const parsedData = {
        err: {}
    };

    const emailRegexp = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
    if (!data.firstName || !data.firstName.trim()) {
        parsedData.err.firstName = 'First name cannot be empty';
    }
    parsedData.firstName = data.firstName;

    if (!data.lastName || !data.lastName.trim()) {
        parsedData.err.lastName = 'Last name cannot be empty';
    }
    parsedData.lastName = data.lastName;

    if (!data.email || !data.email.trim()) {
        parsedData.err.email = 'Email cannot be empty';
    } else {
        if (!data.email.match(emailRegexp)) {
            parsedData.err.email = 'Wrong email format';
        }
    }
    parsedData.email = data.email;

    if (!data.password || !data.password.trim()) {
        parsedData.err.password = 'Password cannot be empty';
        if (data.password.length < constants.minPasswordLength) {
            parsedData.err.password = `Password length mast be more than ${constants.minPasswordLength}`;
        }
    }
    parsedData.password = data.password;

    return parsedData;
};