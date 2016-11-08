const users = require('./../middleware/users-middleware');

module.exports = (server) => {

    server.get('/',
        users.getUsers,
        (req, res, next) => {
            res.send({
                status: 200,
                data: res.data,
            });
            // return next();
        });

    server.post('/users',
        users.createUser,
        (req, res) => {
            res.json({
                status: 200,
                data: res.data,
            });
        }
    );
};
