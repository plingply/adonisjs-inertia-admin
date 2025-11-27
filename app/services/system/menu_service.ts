import AdminMenu from '#models/system/admin_menu'
import { handleTree } from '../../utils/index.js'
import { MenuCreateReq, MenuUpdateReq } from '#types/menu'
import CasbinService from '#services/casbin_service'
import AdminUser from '#models/system/admin_user'

export class MenuService {
  public static publicMenus = ['/login', '/api/login', '/no-permission', '/logout']

  public static isPublicRoute(url: string) {
    return this.publicMenus.includes(url)
  }

  public static async getAllMenuToTree() {
    const menus = await AdminMenu.query().orderBy('order', 'asc')
    const menuArray = menus.map((item) => item.serialize())
    return handleTree(menuArray, 'id', 'parent_id', 'children')
  }

  public static async getUserMenuTree(username: string, user?: AdminUser) {
    if (user && user.isAdmin()) {
      return this.getAllMenuToTree()
    }
    const casbinService = new CasbinService()
    const permissions = await casbinService.getAllPermissionForUser(username)
    const menus = await AdminMenu.query()
      .whereIn('permission', permissions)
      .orWhereNull('permission')
      .orderBy('order', 'asc')
    const menuArray = menus.map((item) => item.serialize())
    const tree = handleTree(menuArray, 'id', 'parent_id', 'children')
    return tree.filter((item) => item.parent_id === 0)
  }

  public static async saveMenuAll(menus: any[]) {
    // 新增菜单
    await AdminMenu.updateOrCreateMany(['id'], menus)
    return true
  }

  public static async delMenuById(id: number) {
    const tree = await this.getAllMenuToTree()
    const ids = this.findChildrenIdsForTreeById(tree, id)
    await AdminMenu.query().whereIn('id', ids).delete()
    return true
  }

  public static formatTreeToArray(tree: any[]) {
    const array = [] as any[]
    function loop(treeArray: any[]) {
      treeArray.forEach((item) => {
        array.push(item)
        if (item.children) {
          loop(item.children)
        }
      })
    }
    loop(tree)
    return array
  }

  public static findChildrenIdsForTreeById(tree: any[], id: number) {
    const ids: number[] = []
    let child = null as any
    function loop(treeData: any[]) {
      if (child) return child
      treeData.forEach((item) => {
        if (item.id === id) {
          child = item
        } else {
          if (item.children) {
            loop(item.children)
          }
        }
      })
    }
    loop(tree)
    if (child) {
      ids.push(child.id)
      if (child.children) {
        const childIds = this.formatTreeToArray(child.children).map((item) => item.id)
        ids.push(...childIds)
      }
    }
    return ids
  }

  public static async createMenu(data: MenuCreateReq) {
    await AdminMenu.create(data)
    return true
  }

  public static async updateMenu(data: MenuUpdateReq) {
    const menu = await AdminMenu.query().where('id', data.id).first()
    if (!menu) return false
    menu.icon = data.icon
    menu.order = data.order
    menu.parentId = data.parent_id
    menu.permission = data.permission || null
    menu.title = data.title
    menu.uri = data.uri
    await menu.save()
    return true
  }
}
