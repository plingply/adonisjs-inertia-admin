import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export default class AdminOperationLog extends BaseModel {
  @column({ isPrimary: true })
  declare id: unknown

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

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime | null

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
