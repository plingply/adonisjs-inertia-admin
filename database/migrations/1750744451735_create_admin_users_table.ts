import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'admin_users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .string('username', 190)
        .notNullable()
        .unique({ indexName: 'admin_users_username_unique' })
      table.string('phone', 20).notNullable()
      table.string('openid', 190).defaultTo(null)
      table.string('unionid', 190).defaultTo(null)
      table.string('password', 200).notNullable()
      table.string('name', 190).defaultTo(null)
      table.string('avatar', 190).defaultTo(null)
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
