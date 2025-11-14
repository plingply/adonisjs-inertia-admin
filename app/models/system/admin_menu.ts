import { column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import SoftDeleteTesModel from '#models/public/soft_delete_model'

export default class AdminMenu extends SoftDeleteTesModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare parentId: number | null

  @column()
  declare slug: string

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

  @column.dateTime({
    serialize: (value: DateTime | null) => {
      return value ? value.setZone().toFormat('yyyy-MM-dd HH:mm:ss') : value
    },
  })
  declare deletedAt: DateTime | null
}
