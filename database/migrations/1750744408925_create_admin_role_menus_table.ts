import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'admin_role_menus'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('role_id').notNullable()
      table.integer('menu_id').notNullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
      table.index(['role_id', 'menu_id'], 'admin_role_menu_role_id_menu_id_index')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}