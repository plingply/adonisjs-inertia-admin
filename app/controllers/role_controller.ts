import { HttpContext } from '@adonisjs/core/http'
import Controller from './controller.js'
import { RoleService } from '#services/role_service'
import { paginate } from '../utils/index.js'
import AdminPermission from '#models/admin_permission'

export default class RoleController extends Controller {
  public async index({ request, inertia }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)
    const search = request.input('search', '')
    const roles = await RoleService.getRolePage(page, limit, search)
    const data = paginate(roles)
    const permissions = await AdminPermission.all()
    return inertia.render('role/index', {
      roles: data.item,
      total: data.total,
      permissions,
    })
  }

  public async list({ request }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)
    const search = request.input('search', '')
    const roles = await RoleService.getRolePage(page, limit, search)
    return this.success(paginate(roles))
  }
}
