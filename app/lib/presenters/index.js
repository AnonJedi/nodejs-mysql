const ServiceError = require('../error');

module.exports.success = data => ({
    status: 200,
    data: data,
});

module.exports.fail = (error, data) => {
    if (error instanceof ServiceError) {
        return {
            status: 500,
            message: error.message,
            error: data,
        };
    }
    return {
        status: 500,
        message: 'Internal error',
        error: data,
    };
};
