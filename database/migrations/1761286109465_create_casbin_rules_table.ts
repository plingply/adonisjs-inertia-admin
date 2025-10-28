import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'casbin_rules'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('ptype', 8).nullable().index()
      table.string('v0', 256).nullable().index()
      table.string('v1', 256).nullable().index()
      table.string('v2', 256).nullable().index()
      table.string('v3', 256).nullable()
      table.string('v4', 256).nullable()
      table.string('v5', 256).nullable()

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      // 复合索引
      table.index(['ptype', 'v0', 'v1'], 'idx_ptype_v0_v1')
      table.index(['ptype', 'v0'], 'idx_ptype_v0')
      table.index(['ptype', 'v1'], 'idx_ptype_v1')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
