import { column, manyToMany } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import AdminPermission from './admin_permission.js'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import Model from './model.js'

export default class AdminRole extends Model {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare slug: string

  @column.dateTime({
    autoCreate: true,
    serialize: (value: DateTime | null) => {
      return value ? value.setZone().toFormat('yyyy-MM-dd HH:mm:ss') : value
    },
  })
  declare createdAt: DateTime | null

  @column.dateTime({
    autoCreate: true,
    autoUpdate: true,
    serialize: (value: DateTime | null) => {
      return value ? value.setZone().toFormat('yyyy-MM-dd HH:mm:ss') : value
    },
  })
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
