exports.up = function (knex) {
  return knex.schema.hasTable('products').then(function (exists) {
    if (!exists) {
      return knex.schema
        .createTable('products', function (table) {
          table.increments('id').primary()
          table.string('name').notNullable()
          table.integer('price').notNullable()
          table.timestamp('created_at').defaultTo(knex.fn.now())
          table.timestamp('updated_at').defaultTo(knex.fn.now())
        })
        .then(ok => {
          console.log(ok)
        })
    }
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('products')
}
