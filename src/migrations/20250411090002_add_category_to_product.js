const moment = require('moment');
const currentUtcTime = moment.utc();

exports.up = function (knex) {
    return knex.schema.table('product', function (table) {
        table.integer('categoryId').unsigned().nullable();
        table.foreign('categoryId')
            .references('id')
            .inTable('categories')
            .onDelete('SET NULL')
            .onUpdate('CASCADE');
    });
};

exports.down = function (knex) {
    return knex.schema.table('product', function (table) {
        table.dropForeign(['categoryId']);
        table.dropColumn('categoryId');
    });
}; 