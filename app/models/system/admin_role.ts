import { column, manyToMany } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import AdminPermission from './admin_permission.js'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import SoftDeleteTesModel from '#models/public/soft_delete_model'

export default class AdminRole extends SoftDeleteTesModel {
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

  @column.dateTime({
    serialize: (value: DateTime | null) => {
      return value ? value.setZone().toFormat('yyyy-MM-dd HH:mm:ss') : value
    },
  })
  declare deletedAt: DateTime | null

  @manyToMany(() => AdminPermission, {
    localKey: 'slug',
    pivotForeignKey: 'v0',
    relatedKey: 'slug',
    pivotRelatedForeignKey: 'v1',
    pivotTable: 'casbin_rules',
    pivotTimestamps: true,
  })
  declare permissions: ManyToMany<typeof AdminPermission>
}
