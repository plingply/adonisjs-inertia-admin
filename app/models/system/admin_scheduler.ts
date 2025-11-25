import SoftDeleteTesModel from '#models/public/soft_delete_model'
import { column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export default class AdminScheduler extends SoftDeleteTesModel {
  static table = 'admin_schedulers'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare command: string

  @column()
  declare cron: string

  @column({
    serialize: (value: number) => {
      return value ? true : false
    },
  })
  declare is_active: boolean

  @column()
  declare description: string

  @column()
  declare group: string

  @column()
  declare args: string[]

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

  @column.dateTime()
  declare deletedAt: DateTime | null
}
