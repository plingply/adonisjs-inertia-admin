import { HttpContext } from '@adonisjs/core/http'
import Controller from './controller.js'
export default class AuthController extends Controller {
  public async index({ inertia }: HttpContext) {
    return inertia.render('index')
  }
}
