import AdminUser from '#models/system/admin_user'

export class AuthService {
  public static async login(username: string, password: string) {
    const res = await AdminUser.verifyCredentials(username, password)
    return res
  }

  public static isAdmin(user: AdminUser) {
    return !!user.roles?.find((item) => item.slug === 'administrator')
  }

  public static hasRole(user: AdminUser, role: string | string[]) {
    // TODO
    return true
  }

  public static hasPermissions(user: AdminUser, permission: string | string[]) {
    if (!permission) return false
    // TODO
    return true
  }
}
