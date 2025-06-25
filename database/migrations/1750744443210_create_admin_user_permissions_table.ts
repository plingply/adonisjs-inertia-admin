import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'admin_user_permissions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('user_id').notNullable()
      table.integer('permission_id').notNullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
      table.index(
        ['user_id', 'permission_id'],
        'admin_user_permissions_user_id_permission_id_index'
      )
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
