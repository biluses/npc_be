exports.seed = function (knex, Promise) {
    return knex('versions').truncate().then(() => {
        return knex('versions').insert([{
            id: "1",
            deviceType: "iOS",
            version: "1.0",
        }, {
            id: "2",
            deviceType: "Android",
            version: "1.0",
        }]);
    });
};

