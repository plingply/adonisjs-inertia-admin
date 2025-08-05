import AdminUser from '#models/system/admin_user'

export class AuthService {
  public static async login(username: string, password: string) {
    const res = await AdminUser.verifyCredentials(username, password)
    return res
  }

  public static isAdmin(user: AdminUser) {
    return !!user.roles?.find((item) => item.slug === 'administrator')
  }

  public static hasAllPermissions(user: AdminUser) {
    return user.allPermissions.includes('*')
  }

  public static hasRole(user: AdminUser, role: string | string[]) {
    if (!role) return false
    if (Array.isArray(role)) {
      return user.roles?.some((item) => role.includes(item.slug))
    }
    return user.roles?.some((item) => item.slug === role)
  }

  public static hasPermissions(user: AdminUser, permission: string | string[]) {
    if (!permission) return false
    if (Array.isArray(permission)) {
      return user.allPermissions.some((item) => permission.includes(item))
    }
    return user.allPermissions.some((item) => item === permission)
  }
}
