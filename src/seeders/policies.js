exports.seed = async function (knex) {
    await knex('allPolicy').truncate()
    await knex('allPolicy').insert([
        {
            type: "1",
            description: "This is PRIVACY POLICY"
        },
        {
            type: "2",
            description: "This is Legal Policy"
        },
        {
            type: "3",
            description: "This is Cookies Policy"
        }
    ]);
};
