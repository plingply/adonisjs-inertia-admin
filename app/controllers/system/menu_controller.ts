import { HttpContext } from '@adonisjs/core/http'
import Controller from '../controller.js'
import { MenuService } from '#services/system/menu_service'
import AdminPermission from '#models/system/admin_permission'
import AdminRole from '#models/system/admin_role'
import { CreateMenuValidator, DeleteMenuValidator, UpdateMenuValidator } from '#validators/menu'
export default class MenuController extends Controller {
  public async index({ inertia }: HttpContext) {
    const menus = await MenuService.getAllMenuToTree()
    const permissions = await AdminPermission.query()
    const roles = await AdminRole.query()
    return inertia.render('settings/menu/index', {
      menus,
      permissions,
      roles,
    })
  }

  public async menuTree() {
    const menus = await MenuService.getAllMenuToTree()
    return this.success(menus)
  }

  public async saveMenuAll({ request }: HttpContext) {
    const menus = request.input('menus')
    try {
      await MenuService.saveMenuAll(menus)
      return this.success()
    } catch (error) {
      return this.error(error)
    }
  }

  public async delMenuById({ request }: HttpContext) {
    const payload = await DeleteMenuValidator.validate(request.all())
    await MenuService.delMenuById(payload.id)
    return this.success()
  }

  public async create({ request }: HttpContext) {
    const payload = await CreateMenuValidator.validate(request.all())
    await MenuService.createMenu(payload)
    return this.success()
  }

  public async update({ request }: HttpContext) {
    const payload = await UpdateMenuValidator.validate(request.all())
    await MenuService.updateMenu(payload)
    return this.success()
  }
}
