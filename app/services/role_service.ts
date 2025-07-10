import AdminRole from '#models/admin_role'

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
}
