import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'admin_permissions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name', 50).notNullable()
      table.string('slug', 50).notNullable()
      table.json('permissions').defaultTo(null)
      table.timestamp('created_at').nullable()
      table.timestamp('updated_at').nullable()
      table.timestamp('deleted_at').nullable()

      table.unique(['slug', 'deleted_at'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
