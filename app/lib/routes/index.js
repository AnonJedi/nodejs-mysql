const users = require('./../middleware/users-middleware');

module.exports = (server) => {

    server.get('/users',
        users.getUsersPage
    );

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
