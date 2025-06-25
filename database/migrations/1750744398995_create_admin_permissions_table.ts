import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'admin_permissions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name', 50).notNullable().unique({ indexName: 'admin_permissions_name_unique' })
      table.string('slug', 50).notNullable().unique({ indexName: 'admin_permissions_slug_unique' })
      table.string('http_method', 191).defaultTo(null)
      table.text('http_path').defaultTo(null)
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}