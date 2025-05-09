exports.seed = async function (knex) {
    await knex('color').truncate()
    await knex('color').insert([
        {
            id: 1,
            name: "No Color",
            code: null
        },
    ]);
};
