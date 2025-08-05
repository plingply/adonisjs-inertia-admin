import { column, computed, manyToMany } from '@adonisjs/lucid/orm'
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

  @column.dateTime({
    serialize: (value: DateTime | null) => {
      return value ? value.setZone().toFormat('yyyy-MM-dd HH:mm:ss') : value
    },
  })
  declare deletedAt: DateTime | null

  @manyToMany(() => AdminPermission, {
    localKey: 'id',
    pivotForeignKey: 'user_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'permission_id',
    pivotTable: 'admin_user_permissions',
    pivotTimestamps: true,
  })
  declare permissions: ManyToMany<typeof AdminPermission>

  @manyToMany(() => AdminRole, {
    localKey: 'id',
    pivotForeignKey: 'user_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'role_id',
    pivotTable: 'admin_role_users',
    pivotTimestamps: true,
  })
  declare roles: ManyToMany<typeof AdminRole>

  @computed()
  get allPermissions() {
    const permissions = this.permissions?.map((item: AdminPermission) => item.slug) || []
    const rolesPermissions =
      this.roles?.map(
        (item) => item.permissions?.map((list: AdminPermission) => list.slug) || []
      ) || []
    rolesPermissions.forEach((item) => {
      permissions.push(...item)
    })
    return [...new Set(permissions)]
  }

  public hasRole(role: string | string[]) {
    if (!role || !role.length) return false
    return AuthService.hasRole(this, role)
  }

  public hasPermission(permission: string | string[]) {
    if (!permission || !permission.length) return false
    return AuthService.hasPermissions(this, permission)
  }
}
