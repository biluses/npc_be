exports.up = function (knex) {
    const moment = require('moment');
    const currentUtcTime = moment.utc();

    return knex.schema.createTable("cart", function (table) {
        table.increments("id").primary().index();
        table.integer('userId').unsigned(); // optional: if you support user accounts
        table.integer('productVariantId').unsigned().notNullable().references('id').inTable('productVariant').onDelete('CASCADE');
        table.integer('quantity').notNullable().defaultTo(1);
        table.timestamp("createdAt").defaultTo(currentUtcTime.format('YYYY-MM-DD HH:mm:ss'));
        table.timestamp("updatedAt").defaultTo(currentUtcTime.format('YYYY-MM-DD HH:mm:ss'));
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable("cart");
};