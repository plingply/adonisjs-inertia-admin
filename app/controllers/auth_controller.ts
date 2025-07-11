import { AuthService } from '#services/auth_service'
import { loguinValidator } from '#validators/auth'
import { HttpContext } from '@adonisjs/core/http'
import Controller from './controller.js'
export default class AuthController extends Controller {
  public async login({ request, auth, session }: HttpContext) {
    const payload = await loguinValidator.validate(request.all())
    try {
      const user = await AuthService.login(payload.username, payload.password)
      await auth.use('web').login(user, true)
      return this.success(user.serialize())
    } catch (error) {
      session.flashAll()
      session.flashErrors({
        E_TOO_MANY_REQUESTS: 'Too many login attempts, please try again later',
      })
      return this.error('登录失败', error.status)
    }
  }
}
