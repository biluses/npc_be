exports.up = function (knex) {
    const moment = require('moment');
    const currentUtcTime = moment.utc();
    return knex.schema.createTable('categories', function (table) {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.string('image').nullable();
        table.timestamp("createdAt").defaultTo(currentUtcTime.format('YYYY-MM-DD HH:mm:ss'));
        table.timestamp("updatedAt").defaultTo(currentUtcTime.format('YYYY-MM-DD HH:mm:ss'));
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('categories');
}; 