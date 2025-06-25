import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'admin_role_permissions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('role_id').notNullable()
      table.integer('permission_id').notNullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
      table.index(
        ['role_id', 'permission_id'],
        'admin_role_permissions_role_id_permission_id_index'
      )
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
