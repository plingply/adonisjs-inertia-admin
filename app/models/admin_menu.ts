import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import AdminRole from './admin_role.js'

export default class AdminMenu extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare parentId: number | null

  @column()
  declare order: number | null

  @column()
  declare permission: string | null

  @column()
  declare title: string | null

  @column()
  declare icon: string | null

  @column()
  declare uri: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime | null

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @manyToMany(() => AdminRole, {
    localKey: 'id',
    pivotForeignKey: 'menu_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'role_id',
    pivotTable: 'admin_role_menus',
    pivotTimestamps: true,
  })
  declare roles: ManyToMany<typeof AdminRole>
}
