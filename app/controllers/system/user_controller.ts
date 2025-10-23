import { HttpContext } from '@adonisjs/core/http'
import Controller from '../controller.js'
import { paginate } from '../../utils/index.js'
import { UserService } from '#services/system/user_service'
import AdminRole from '#models/system/admin_role'
import AdminPermission from '#models/system/admin_permission'
import { CreateUserValidator, UpdateUserValidator } from '#validators/user'

export default class UserController extends Controller {
  public async index({ request, inertia }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)
    const search = request.input('search', '')
    const users = await UserService.getUserPage(page, limit, search)
    const data = paginate(users)
    const roles = await AdminRole.all()
    const permissions = await AdminPermission.all()
    return inertia.render('settings/user/index', {
      users: data.item,
      total: data.total,
      roles: roles,
      permissions: permissions,
    })
  }

  public async list({ request }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)
    const search = request.input('search', '')
    const roles = await UserService.getUserPage(page, limit, search)
    const data = paginate(roles)
    return this.success(data)
  }

  public async delete({ request }: HttpContext) {
    const id = request.input('id')
    if (!id) return this.error('参数错误')
    const res = await UserService.deleteUserById(id)
    if (!res) return this.error('删除失败')
    return this.success()
  }

  public async create({ request }: HttpContext) {
    const data = request.all()
    const payload = await CreateUserValidator.validate(data)
    const res = await UserService.createUser(payload)
    if (!res) return this.error('创建失败')
    return this.success()
  }

  public async update({ request }: HttpContext) {
    const data = request.all()
    const payload = await UpdateUserValidator.validate(data)
    const res = await UserService.updateUser(payload)
    if (!res) return this.error('更新失败')
    return this.success()
  }
}
