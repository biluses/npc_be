exports.seed = async function (knex) {
    await knex('size').del()
    await knex('size').insert([
        {
            id: 1,
            name: "No Size"
        },
    ]);
};
