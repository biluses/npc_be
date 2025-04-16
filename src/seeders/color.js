exports.seed = async function (knex) {
    await knex('color').del()
    await knex('color').insert([
        {
            id: 1,
            name: "No Color",
            code: null
        },
    ]);
};
