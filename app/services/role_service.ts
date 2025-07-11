import AdminRole from '#models/admin_role'
import AdminRolePermission from '#models/admin_role_permission'

export class RoleService {
  public static async getAllRole() {
    const res = await AdminRole.all()
    return res
  }

  public static async getRolePage(page: number, limit: number, search: string) {
    const query = AdminRole.query().preload('permissions').orderBy('id', 'asc')
    if (search) {
      query.where('name', 'like', `%${search}%`)
    }
    const res = await query.paginate(page, limit)
    return res
  }

  public static async createRole(data: any) {
    const role = new AdminRole()
    role.merge(data)
    await role.save()
    await AdminRolePermission.query().where('role_id', role.id).delete()
    const permissions = [] as any
    data.permissions.forEach((permissionId: number) => {
      permissions.push({
        roleId: role.id,
        permissionId: permissionId,
      })
    })
    await AdminRolePermission.createMany(permissions)
    return true
  }

  public static async updateRole(data: any) {
    const role = await AdminRole.find(data.id)
    if (!role) return false
    role.merge(data)
    await role.save()
    await AdminRolePermission.query().where('role_id', role.id).delete()
    const permissions = [] as any
    data.permissions.forEach((permission: number) => {
      permissions.push({
        roleId: role.id,
        permissionId: permission,
      })
    })
    await AdminRolePermission.createMany(permissions)
    return true
  }

  public static async deleteRoleById(id: number) {
    const role = await AdminRole.find(id)
    if (!role) return false
    await AdminRolePermission.query().where('role_id', role.id).delete()
    await role.delete()
    return true
  }
}
