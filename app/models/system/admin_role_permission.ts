import { column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import Model from '../public/model.js'

export default class AdminRolePermission extends Model {
  @column()
  declare roleId: number

  @column()
  declare permissionId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime | null

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
