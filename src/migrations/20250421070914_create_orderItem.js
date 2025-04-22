exports.up = function (knex) {
    const moment = require('moment');
    const currentUtcTime = moment.utc();

    return knex.schema.createTable("orderItem", function (table) {
        table.increments("id").primary();
        table.integer('orderId').unsigned().references('id').inTable('order').onDelete('CASCADE');
        table.integer('userId').unsigned().references('id').inTable('users').onDelete('CASCADE');
        table.integer('productId').unsigned().references('id').inTable('product').onDelete('CASCADE');
        table.integer('productVariantId').unsigned().references('id').inTable('productVariant').onDelete('CASCADE');
        table.integer("quantity").notNullable();
        table.decimal("price", 10, 2).notNullable();
        table.timestamp("createdAt").defaultTo(currentUtcTime.format('YYYY-MM-DD HH:mm:ss'));
        table.timestamp("updatedAt").defaultTo(currentUtcTime.format('YYYY-MM-DD HH:mm:ss'));
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable("orderItem");
};