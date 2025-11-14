import AdminUser from '#models/system/admin_user'
import CasbinService from '#services/casbin_service'
import hash from '@adonisjs/core/services/hash'

export class UserService {
  public static async getUserPage(page: number, limit: number, search: string) {
    const query = AdminUser.query().preload('permissions').preload('roles').orderBy('id', 'asc')
    if (search) {
      query.where('name', 'like', `%${search}%`)
    }
    const res = await query.paginate(page, limit)
    return res
  }

  public static async createUser(data: any) {
    const user = new AdminUser()
    user.merge(data)
    await user.save()

    // 创建权限
    await this.createUserPermission(data.permissions, user.username)
    // 创建角色
    await this.createUserRole(data.roles, user.username)
    return true
  }

  public static async updateUser(data: any) {
    const user = await AdminUser.find(data.id)
    if (!user) return false
    if (data.password) {
      data.password = await hash.make(data.password)
    }
    user.merge(data)
    await user.save()

    // 创建权限
    await this.createUserPermission(data.permissions, user.username)
    // 创建角色
    await this.createUserRole(data.roles, user.username)
    return true
  }

  public static async deleteUserById(id: number) {
    const user = await AdminUser.find(id)
    if (!user) return false
    const casbinService = new CasbinService()
    await casbinService.deleteRolesForUser(user.username)
    return true
  }

  public static async createUserPermission(permissions: string[], username: string) {
    const casbinService = new CasbinService()
    await casbinService.deletePermissionsForUser(username)
    for (const permission of permissions) {
      await casbinService.addPermissionForUser(username, permission)
    }
  }

  public static async createUserRole(roles: string[], username: string) {
    const casbinService = new CasbinService()
    await casbinService.deleteRolesForUser(username)
    for (const role of roles) {
      await casbinService.addUserRole(username, role)
    }
  }
}
