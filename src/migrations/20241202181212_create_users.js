exports.up = function (knex) {
    const moment = require('moment');
    const currentUtcTime = moment.utc();

    return knex.schema.createTable("users", function (table) {
        table.increments("id").primary().index();
        table.string("secretId").notNullable().index();
        table.string("email").index().notNullable();
        table.string("password").notNullable();
        table.string("loginType").notNullable();
        table.string("googleId").nullable();
        table.string("appleId").nullable();
        table.string("username").nullable();
        table.string("profilePicture").nullable();
        table.string("address1").nullable();
        table.string("address2").nullable();
        table.string("city").nullable();
        table.string("state").nullable();
        table.string("postalCode").nullable();
        table.string("verificationToken").nullable();
        table.string("forgotCode").nullable();
        table.boolean("isDeleted").defaultTo(false).index();
        table.boolean("isCompletedRegister").defaultTo(false).index();
        table.timestamp("createdAt").defaultTo(currentUtcTime.format('YYYY-MM-DD HH:mm:ss'));
        table.timestamp("updatedAt").defaultTo(currentUtcTime.format('YYYY-MM-DD HH:mm:ss'));
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable("users");
};