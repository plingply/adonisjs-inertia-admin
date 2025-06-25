import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export default class AdminPermission extends BaseModel {
  @column({ isPrimary: true })
  declare id: unknown

  @column()
  declare name: string

  @column()
  declare slug: string

  @column()
  declare httpMethod: string | null

  @column()
  declare httpPath: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime | null

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
