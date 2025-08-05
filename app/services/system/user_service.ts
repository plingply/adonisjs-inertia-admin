import AdminRoleUser from '#models/system/admin_role_user'
import AdminUser from '#models/system/admin_user'
import AdminUserPermission from '#models/system/admin_user_permission'
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
    data.password = await hash.make(data.password)
    user.merge(data)
    await user.save()
    // 创建权限
    await this.createUserPermission(data.permissions, user.id)
    // 创建角色
    await this.createUserRole(data.roles, user.id)
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
    await this.createUserPermission(data.permissions, user.id)
    // 创建角色
    await this.createUserRole(data.roles, user.id)
    return true
  }

  public static async deleteUserById(id: number) {
    const user = await AdminUser.find(id)
    if (!user) return false
    await user.delete()
    await AdminUserPermission.query().where('user_id', user.id).delete()
    await AdminRoleUser.query().where('user_id', user.id).delete()
    return true
  }

  public static async createUserPermission(permissionIds: number[], userId: number) {
    await AdminUserPermission.query().where('user_id', userId).delete()
    const permissions = [] as any
    permissionIds.forEach((permissionId: number) => {
      permissions.push({
        userId: userId,
        permissionId: permissionId,
      })
    })
    await AdminUserPermission.createMany(permissions)
  }

  public static async createUserRole(roleIds: number[], userId: number) {
    await AdminRoleUser.query().where('user_id', userId).delete()
    const roles = [] as any
    roleIds.forEach((roleId: number) => {
      roles.push({
        userId: userId,
        roleId: roleId,
      })
    })
    await AdminRoleUser.createMany(roles)
  }
}
