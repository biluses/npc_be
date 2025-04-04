exports.up = function (knex) {
    const moment = require('moment');
    const currentUtcTime = moment.utc();

    return knex.schema.createTable("post", function (table) {
        table.increments("id").primary().index();
        table.integer("userId").notNullable().index();
        table.integer("withUserId").nullable().index();
        table.string("postImage").nullable();
        table.text("caption").index().nullable();
        table.boolean("isDeleted").defaultTo(false).index();
        table.timestamp("createdAt").defaultTo(currentUtcTime.format('YYYY-MM-DD HH:mm:ss'));
        table.timestamp("updatedAt").defaultTo(currentUtcTime.format('YYYY-MM-DD HH:mm:ss'));
    }).then(() =>
        knex.raw(`ALTER TABLE post CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`)
    );
};

exports.down = function (knex) {
    return knex.schema.dropTable("post");
};