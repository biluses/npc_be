module.exports = {
    development: {
        client: 'mysql2',
        connection: {
            database: 'npc',
            user: 'root',
            host: "localhost",
            port: "3306",
            password: '',
        },
        migrations: {
            directory: './src/migrations',
        },
        seeds: {
            directory: './src/seeders'
        }
    },

    staging: {
        client: 'mysql2',
        connection: {
            database: '',
            user: '',
            host: "",
            port: "",
            password: ''
        },
        migrations: {
            directory: './src/migrations',
        },
        seeds: {
            directory: './src/seeders'
        }
    },
};