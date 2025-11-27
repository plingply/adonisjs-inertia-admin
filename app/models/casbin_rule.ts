import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
export default class CasbinRule extends BaseModel {
  static table = 'casbin_rules'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare ptype: string // 'p' for policy, 'g' for grouping

  @column({
    columnName: 'v0',
  })
  declare v0: string | null // user or role

  @column({
    columnName: 'v1',
  })
  declare v1: string | null // resource or role

  @column({
    columnName: 'v2',
  })
  declare v2: string | null // action

  @column({
    columnName: 'v3',
  })
  declare v3: string | null // extra field

  @column({
    columnName: 'v4',
  })
  declare v4: string | null // extra field

  @column({
    columnName: 'v5',
  })
  declare v5: string | null // extra field

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
}
