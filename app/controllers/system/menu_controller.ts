import { HttpContext } from '@adonisjs/core/http'
import Controller from '../controller.js'
import { MenuService } from '#services/menu_service'
import AdminPermission from '#models/admin_permission'
import AdminRole from '#models/admin_role'
export default class MenuController extends Controller {
  public async index({ inertia }: HttpContext) {
    const menus = await MenuService.getAllMenuToTree()
    const permissions = await AdminPermission.query()
    const roles = await AdminRole.query()
    const icons = await MenuService.getAllMenuIcons()
    return inertia.render('menu/index', {
      menus,
      permissions,
      roles,
      icons,
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
    const id = request.input('id')
    await MenuService.delMenuById(id)
    return this.success()
  }

  public async create({ request }: HttpContext) {
    const data = request.all()
    await MenuService.createMenu(data)
    return this.success()
  }

  public async update({ request }: HttpContext) {
    const data = request.all()
    await MenuService.updateMenu(data)
    return this.success()
  }
}
