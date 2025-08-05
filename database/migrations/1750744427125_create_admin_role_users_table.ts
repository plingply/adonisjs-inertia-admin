import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'admin_role_users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('role_id').notNullable()
      table.integer('user_id').notNullable()
      table.timestamp('created_at').nullable()
      table.timestamp('updated_at').nullable()
      table.timestamp('deleted_at').nullable()
      table.index(['role_id', 'user_id'], 'admin_role_users_role_id_user_id_index')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
