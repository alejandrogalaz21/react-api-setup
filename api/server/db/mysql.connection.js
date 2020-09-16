import { MYSQL } from '../../keys'

export const knex = require('knex')({
  client: 'mysql',
  connection: {
    ...MYSQL,
    database: 'database'
  }
})
