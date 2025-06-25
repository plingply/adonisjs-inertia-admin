import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export default class AdminMenu extends BaseModel {
  @column({ isPrimary: true })
  declare id: unknown

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
}
