import { column, manyToMany } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { DbRememberMeTokensProvider } from '@adonisjs/auth/session'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import AdminPermission from './admin_permission.js'
import AdminRole from './admin_role.js'
import { AuthService } from '#services/system/auth_service'
import SoftDeleteTesModel from '#models/public/soft_delete_model'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['username'],
  passwordColumnName: 'password',
})

export default class AdminUser extends compose(SoftDeleteTesModel, AuthFinder) {
  static rememberMeTokens = DbRememberMeTokensProvider.forModel(AdminUser, {
    table: 'admin_remember_me_tokens',
  })

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare username: string

  @column()
  declare phone: string

  @column()
  declare openid: string | null

  @column()
  declare unionid: string | null

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare name: string | null

  @column()
  declare avatar: string | null

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

  @manyToMany(() => AdminPermission, {
    localKey: 'username',
    pivotForeignKey: 'v0',
    relatedKey: 'slug',
    pivotRelatedForeignKey: 'v1',
    pivotTable: 'casbin_rules',
    pivotTimestamps: true,
  })
  declare permissions: ManyToMany<typeof AdminPermission>

  @manyToMany(() => AdminRole, {
    localKey: 'username',
    pivotForeignKey: 'v0',
    relatedKey: 'slug',
    pivotRelatedForeignKey: 'v1',
    pivotTable: 'casbin_rules',
    pivotTimestamps: true,
  })
  declare roles: ManyToMany<typeof AdminRole>

  isAdmin(): boolean {
    return AuthService.isAdmin(this)
  }
}
