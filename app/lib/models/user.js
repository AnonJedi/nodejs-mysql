const bookshelf = require('./../database');

module.exports = bookshelf.Model.extend({
    tableName: 'users',
    uuid: true,
    hasTimestamps: ['created_at', 'updated_at', 'deleted_at'],
});
