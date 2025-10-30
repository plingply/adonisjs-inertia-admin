import AdminPermission from '#models/system/admin_permission'
import CasbinService from '#services/casbin_service'
import { PermissionCreateReq, PermissionUpdateReq } from '#types/permission'

export class PeimissionService {
  public static async getPeimissionPage(page: number, limit: number, search: string) {
    const query = AdminPermission.query().orderBy('id', 'asc')
    if (search) {
      query.where('name', 'like', `%${search}%`)
    }
    const res = await query.paginate(page, limit)
    return res
  }

  public static async createPeimission(data: PermissionCreateReq) {
    const permissionModel = new AdminPermission()
    permissionModel.name = data.name
    permissionModel.slug = data.slug
    permissionModel.permissions = JSON.stringify(data.permissions)
    await permissionModel.save()
    const casbinService = new CasbinService()
    if (data.permissions && data.permissions.length > 0) {
      for (const permission of data.permissions) {
        for (const method of permission.http_method) {
          await casbinService.addPolicy(data.slug, permission.http_path, method)
        }
      }
    }
    return true
  }

  public static async updatePeimission(data: PermissionUpdateReq) {
    const permissionModel = await AdminPermission.find(data.id)
    if (!permissionModel) return false
    permissionModel.name = data.name
    permissionModel.permissions = JSON.stringify(data.permissions)
    await permissionModel.save()
    const casbinService = new CasbinService()
    await casbinService.deletePeimissionPolicys(permissionModel.slug)
    if (data.permissions && data.permissions.length > 0) {
      for (const permission of data.permissions) {
        for (const method of permission.http_method) {
          await casbinService.addPolicy(permissionModel.slug, permission.http_path, method)
        }
      }
    }
    return true
  }

  public static async deletePeimissionById(id: number) {
    const permissionModel = await AdminPermission.find(id)
    if (!permissionModel) return false
    const casbinService = new CasbinService()
    await casbinService.deletePeimission(permissionModel.slug)
    await permissionModel.delete()
    return true
  }
}
