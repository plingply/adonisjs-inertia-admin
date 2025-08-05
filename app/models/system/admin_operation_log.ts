import { belongsTo, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import AdminUser from './admin_user.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Model from '../public/model.js'

export default class AdminOperationLog extends Model {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare path: string

  @column()
  declare method: string

  @column()
  declare ip: string

  @column()
  declare input: string

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

  @belongsTo(() => AdminUser, {
    foreignKey: 'userId',
    localKey: 'id',
  })
  declare user: BelongsTo<typeof AdminUser>
}
