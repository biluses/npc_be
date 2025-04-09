exports.up = function (knex) {
    return knex.schema.alterTable("users", function (table) {
        table.integer('inChatUserId').nullable();
    });
};

exports.down = function (knex) {
    return knex.schema.alterTable("users", function (table) {
        table.dropColumn("inChatUserId");
    });
};