import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import AdminPermission from './admin_permission.js'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'

export default class AdminRole extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare slug: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime | null

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @manyToMany(() => AdminPermission, {
    localKey: 'id',
    pivotForeignKey: 'role_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'permission_id',
    pivotTable: 'admin_role_permissions',
    pivotTimestamps: true,
  })
  declare permissions: ManyToMany<typeof AdminPermission>
}
