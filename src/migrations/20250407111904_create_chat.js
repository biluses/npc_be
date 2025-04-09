exports.up = function (knex) {
    const moment = require('moment');
    const currentUtcTime = moment.utc();

    return knex.schema.createTable("chats", function (table) {
        table.increments("id").primary().index();
        table.integer("senderId").notNullable().index();
        table.integer("receiverId").notNullable().index();
        table.integer("tokenId").nullable().index();
        table.text('message').nullable()
        table.string('messageType').defaultsTo("text").index();
        table.text('messageData').nullable();
        table.text('vedioThumbnail').nullable();
        table.enu('messageStatus', ['sent', 'deliver', 'read']).defaultsTo('sent').index();
        table.timestamp("createdAt").defaultTo(currentUtcTime.format('YYYY-MM-DD HH:mm:ss'));
        table.timestamp("updatedAt").defaultTo(currentUtcTime.format('YYYY-MM-DD HH:mm:ss'));
    }).then(() =>
        knex.raw(`ALTER TABLE chats CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`)
    );
};

exports.down = function (knex) {
    return knex.schema.dropTable("chats");
};