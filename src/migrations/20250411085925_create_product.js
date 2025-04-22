exports.up = function (knex) {
    const moment = require('moment');
    const currentUtcTime = moment.utc();

    return knex.schema.createTable("product", function (table) {
        table.increments("id").primary().index();
        table.string('name').notNullable();
        table.text('description');
        table.decimal('price', 10, 2).notNullable().defaultTo(0.00);
        table.boolean("isPin").defaultTo(false).index();
        table.boolean("isDeleted").defaultTo(false).index();
        table.timestamp("createdAt").defaultTo(currentUtcTime.format('YYYY-MM-DD HH:mm:ss'));
        table.timestamp("updatedAt").defaultTo(currentUtcTime.format('YYYY-MM-DD HH:mm:ss'));
    }).then(() =>
        knex.raw(`ALTER TABLE product CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`)
    );
};

exports.down = function (knex) {
    return knex.schema.dropTable("product");
};