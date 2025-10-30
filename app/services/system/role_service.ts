import AdminRole from '#models/system/admin_role'
import CasbinService from '#services/casbin_service'
import { RoleUpdateReq, RoleCreateReq } from '#types/role'

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

  public static async createRole(data: RoleCreateReq) {
    const role = new AdminRole()
    role.merge(data)
    await role.save()
    const casbinService = new CasbinService()
    for (const permission of data.permissions) {
      await casbinService.addUserRole(data.slug, permission)
    }
    return true
  }

  public static async updateRole(data: RoleUpdateReq) {
    const role = await AdminRole.find(data.id)
    if (!role) return false
    role.name = data.name
    await role.save()
    const casbinService = new CasbinService()
    await casbinService.deletePermissionsForRole(role.slug)
    for (const permission of data.permissions) {
      await casbinService.addPermissionForRole(role.slug, permission)
    }
    return true
  }

  public static async deleteRoleById(id: number) {
    const role = await AdminRole.find(id)
    if (!role) return false
    const casbinService = new CasbinService()
    await casbinService.deleteRole(role.slug)
    await role.delete()
    return true
  }
}
