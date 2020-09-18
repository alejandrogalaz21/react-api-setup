const { MYSQL } = require('./keys')

module.exports = {
  development: {
    client: 'mysql',
    connection: {
      ...MYSQL,
      host: '127.0.0.1',
      database: 'database'
    },
    migrations: {
      directory: __dirname + '/knex/migrations'
    },
    seeds: {
      directory: __dirname + '/knex/seeds'
    }
  }
}
