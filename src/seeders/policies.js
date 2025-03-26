exports.seed = async function (knex) {
    await knex('policy').del()
    await knex('policy').insert([
        {
            type: "1",
            description: "This is PRIVACY POLICY"
        },
        {
            type: "2",
            description: "This is TERMS AND CONDITIONS"
        }
    ]);
};
