exports.up = function (knex) {
    const moment = require('moment');
    const currentUtcTime = moment.utc();

    return knex.schema.createTable("order", function (table) {
        table.increments('id').primary();
        table.string('orderNo').unique().notNullable();
        table.integer('status').defaultTo(1);
        table.integer('userId').unsigned().references('id').inTable('users').onDelete('CASCADE');
        table.decimal('totalAmount', 10, 2).notNullable();
        table.timestamp("createdAt").defaultTo(currentUtcTime.format('YYYY-MM-DD HH:mm:ss'));
        table.timestamp("updatedAt").defaultTo(currentUtcTime.format('YYYY-MM-DD HH:mm:ss'));
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable("order");
};