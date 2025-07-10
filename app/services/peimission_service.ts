import AdminPermission from '#models/admin_permission'
import AdminRolePermission from '#models/admin_role_permission'
import AdminUserPermission from '#models/admin_user_permission'

export class PeimissionService {
  public static async getPeimissionPage(page: number, limit: number, search: string) {
    const query = AdminPermission.query().orderBy('id', 'asc')
    if (search) {
      query.where('name', 'like', `%${search}%`)
    }
    const res = await query.paginate(page, limit)
    return res
  }

  public static async updatePeimission(data: any) {
    const permission = await AdminPermission.find(data.id)
    if (!permission) return false
    permission.merge(data)
    await permission.save()
    return true
  }

  public static async deletePeimissionById(id: number) {
    const permission = await AdminPermission.find(id)
    if (!permission) return false
    await AdminRolePermission.query().where('permission_id', permission.id).delete()
    await AdminUserPermission.query().where('permission_id', permission.id).delete()
    await permission.delete()
    return true
  }
}
