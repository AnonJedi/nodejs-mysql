
exports.up = function(knex, Promise) {
    return knex.schema.createTable('users', function(table) {
        table.string('id').primary();
        table.string('status').notNullable();
        table.string('first_name');
        table.string('last_name');
        table.string('email').unique().notNullable();
        table.string('password');
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
        table.timestamp('deleted_at');
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('users');
};
