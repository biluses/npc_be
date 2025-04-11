exports.up = function (knex) {
    const moment = require('moment');
    const currentUtcTime = moment.utc();

    return knex.schema.createTable("productVariant", function (table) {
        table.increments("id").primary().index();
        table.integer('productId').unsigned().references('id').inTable('product').onDelete('CASCADE');
        table.integer('colorId').unsigned().references('id').inTable('color').onDelete('SET NULL');
        table.integer('sizeId').unsigned().references('id').inTable('size').onDelete('SET NULL');
        table.integer('quantity').defaultTo(0);
        table.timestamp("createdAt").defaultTo(currentUtcTime.format('YYYY-MM-DD HH:mm:ss'));
        table.timestamp("updatedAt").defaultTo(currentUtcTime.format('YYYY-MM-DD HH:mm:ss'));
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable("productVariant");
};