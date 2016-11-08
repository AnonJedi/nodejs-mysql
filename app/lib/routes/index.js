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

    server.get('/users/:userId',
        users.getUserById
    );

    server.post('/users',
        users.createUser
    );

    server.del('/users/:userId',
        users.deleteUser
    );

    server.put('/users/:userId',
        users.updateUser
    );
};
