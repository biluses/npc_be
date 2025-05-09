exports.seed = async function (knex) {
    await knex('size').truncate()
    await knex('size').insert([
        {
            id: 1,
            name: "No Size"
        },
    ]);
};
