import { HttpContext } from '@adonisjs/core/http'
import Controller from '../controller.js'
import { RoleService } from '#services/system/role_service'
import { paginate } from '#utils/index'
import AdminPermission from '#models/system/admin_permission'
import { CreateRoleValidator, DeleteRoleValidator, UpdateRoleValidator } from '#validators/role'

export default class RoleController extends Controller {
  public async index({ request, inertia }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)
    const search = request.input('search', '')
    const roles = await RoleService.getRolePage(page, limit, search)
    const data = paginate(roles)
    const permissions = await AdminPermission.all()
    return inertia.render('settings/role/index', {
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
    const data = paginate(roles)
    return this.success(data)
  }

  public async delete({ request }: HttpContext) {
    const payload = await DeleteRoleValidator.validate(request.all())
    const res = await RoleService.deleteRoleById(payload.id)
    if (!res) return this.error('删除失败')
    return this.success()
  }

  public async create({ request }: HttpContext) {
    const payload = await CreateRoleValidator.validate(request.all())
    const res = await RoleService.createRole(payload)
    if (!res) return this.error('创建失败')
    return this.success()
  }

  public async update({ request }: HttpContext) {
    const payload = await UpdateRoleValidator.validate(request.all())
    const res = await RoleService.updateRole(payload)
    if (!res) return this.error('更新失败')
    return this.success()
  }
}
