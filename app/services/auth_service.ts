import AdminUser from '#models/admin_user'

export class AuthService {
  public static async login(username: string, password: string) {
    return await AdminUser.verifyCredentials(username, password)
  }
}
