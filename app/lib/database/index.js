const knex = require('knex')({
    client: 'mysql',
    connection: {
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        charset: 'utf8',
        timezone: 'UTC',
    },
});

const bookshelf = require('bookshelf')(knex);
bookshelf.plugin(require('bookshelf-camelcase'));
bookshelf.plugin(require('bookshelf-uuid'), {
    type: () => `US_${require('uuid').v1()}`,
});

module.exports = bookshelf;
