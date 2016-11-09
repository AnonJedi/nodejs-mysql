const constants = require('../constants');
const emailRegexp = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;


module.exports.parseGetUsersPage = (data) => {
    const parsedData = {
        err: {},
    };

    if (!data.page) {
        parsedData.err.page = 'Page number is required';
    } else {
        parsedData.page = Number.parseInt(data.page);
        if (!parsedData.page && parsedData.page !== 0) {
            parsedData.err.page = 'Page mast be integer number';
        }
    }


    if (!data.pageSize) {
        parsedData.err.pageSize = 'Page size is required';
    } else {
        parsedData.pageSize = Number.parseInt(data.pageSize);
        if (!parsedData.pageSize && parsedData.pageSize !== 0) {
            parsedData.err.pageSize = 'Page size mast be integer number';
        }
    }

    return parsedData;
};

module.exports.parseEmailAndPassword =  (data) => {
    const parsedData = {
        err: {},
    };

    if (!data.email || !data.email.trim()) {
        parsedData.err.email = 'Email cannot be empty';
    } else if (!data.email.match(emailRegexp)) {
        parsedData.err.email = 'Wrong email format';
    }
    parsedData.email = data.email;

    if (!data.password || !data.password.trim()) {
        parsedData.err.password = 'Password cannot be empty';
    } else if (data.password.length < constants.minPasswordLength) {
        parsedData.err.password = `Password length mast be more than ${constants.minPasswordLength}`;
    }
    parsedData.password = data.password;

    return parsedData;
};

module.exports.parseCreateUser = (data) => {
    const parsedData = {
        err: {},
    };

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
    } else if (!data.email.match(emailRegexp)) {
        parsedData.err.email = 'Wrong email format';
    }
    parsedData.email = data.email;

    if (!data.password || !data.password.trim()) {
        parsedData.err.password = 'Password cannot be empty';
    } else if (data.password.length < constants.minPasswordLength) {
        parsedData.err.password = `Password length mast be more than ${constants.minPasswordLength}`;
    }
    parsedData.password = data.password;

    return parsedData;
};

module.exports.parseImportUsers = (data) => {
    const parsedData = {
        err: {},
    };

    if (!data.users || !(data.users instanceof Array)) {
        parsedData.err.users = 'Wrong faormat of users list';
    }
    parsedData.users = data.users;
    return parsedData;
};

module.exports.parseUpdateUser = (data) => {
    const parsedData = {
        err: {},
    };

    if (data.firstName !== undefined) {
        if (!data.firstName.trim()) {
            parsedData.err.firstName = 'First name cannot be empty';
        }
        parsedData.firstName = data.firstName;
    }

    if (data.lastName !== undefined) {
        if (!data.lastName.trim()) {
            parsedData.err.lastName = 'Last name cannot be empty';
        }
        parsedData.lastName = data.lastName;
    }

    if (data.email !== undefined) {
        if (!data.email.trim()) {
            parsedData.err.email = 'Email cannot be empty';
        } else if (!data.email.match(emailRegexp)) {
            parsedData.err.email = 'Wrong email format';
        }
        parsedData.email = data.email;
    }

    if (data.password !== undefined) {
        if (!data.password.trim()) {
            parsedData.err.password = 'Password cannot be empty';
        } else if (data.password.length < constants.minPasswordLength) {
            parsedData.err.password = `Password length mast be more than ${constants.minPasswordLength}`;
        }
        parsedData.password = data.password;
    }

    return parsedData;
};
