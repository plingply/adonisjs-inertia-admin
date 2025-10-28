import AdminMenu from '#models/system/admin_menu'
import { handleTree } from '../../utils/index.js'
import fs from 'node:fs'
import path from 'node:path'
import { MenuCreateReq, MenuUpdateReq } from '#types/menu'
import CasbinService from '#services/casbin_service'
import AdminUser from '#models/system/admin_user'

export class MenuService {
  public static publicMenus = ['/login', '/api/login', '/no-permission']

  public static isPublicRoute(url: string) {
    return this.publicMenus.includes(url)
  }

  public static async getAllMenuToTree() {
    const menus = await AdminMenu.query().preload('roles').orderBy('order', 'asc')
    const menuArray = menus.map((item) => item.serialize())
    return handleTree(menuArray, 'id', 'parent_id', 'children')
  }

  public static async getUserMenuTree(username: string, user?: AdminUser) {
    if (user && user.isAdmin()) {
      return this.getAllMenuToTree()
    }
    const casbinService = new CasbinService()
    const permissions = await casbinService.getPermissionForUser(username)
    const roles = await casbinService.getRolesForUser(username)
    let menuSlug = [] as string[]
    for (const permission of permissions) {
      const perarr = await casbinService.getRolesForUser(permission)
      menuSlug = menuSlug.concat(perarr)
    }
    for (const role of roles) {
      const perarr = await casbinService.getRolesForUser(role)
      menuSlug = menuSlug.concat(perarr)
    }
    const menus = await AdminMenu.query().preload('roles').whereIn('slug', menuSlug)
    const menuArray = menus.map((item) => item.serialize())
    const tree = handleTree(menuArray, 'id', 'parent_id', 'children')
    return tree.filter((item) => item.parent_id === 0)
  }

  public static async saveMenuAll(menus: any[]) {
    const casbinService = new CasbinService()
    // 新增菜单
    await AdminMenu.updateOrCreateMany(['id'], menus)
    const allMenu = await AdminMenu.query().preload('roles').orderBy('order', 'asc')
    for (const menu of allMenu) {
      menu.slug = `${menu.id}_${menu.parentId}`
      await menu.save()
      await casbinService.deleteMenuPolicy(menu.slug)
      await casbinService.deleteMenuPermissionAndRole(menu.slug)
      if (menu.uri) {
        await casbinService.addMenuPolicy(menu.slug, menu.uri, 'GET')
      }
      if (menu.uri) {
        await casbinService.addMenuPolicy(menu.slug, menu.uri, 'GET')
      }
      if (menu.permission) {
        await casbinService.addGroupingPolicy(menu.permission, menu.slug)
      }
      if (menu.roles && menu.roles.length > 0) {
        for (const role of menu.roles) {
          await casbinService.addGroupingPolicy(role.slug, menu.slug)
        }
      }
    }
    return true
  }

  public static async delMenuById(id: number) {
    const tree = await this.getAllMenuToTree()
    const ids = this.findChildrenIdsForTreeById(tree, id)
    const menus = await AdminMenu.query().whereIn('id', ids).select('slug')
    const casbinService = new CasbinService()
    for (const item of menus) {
      await casbinService.deleteMenuPolicy(item.slug)
      await casbinService.deleteMenuPermissionAndRole(item.slug)
    }
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

  public static getAllMenuIcons() {
    const icons = [] as string[]
    function getFiles(dir: string, splitFirName: string) {
      const stat = fs.statSync(dir)
      if (stat.isDirectory()) {
        //判断是不是目录
        const dirs = fs.readdirSync(dir)
        dirs.forEach((value) => {
          getFiles(path.join(dir, value), splitFirName)
        })
      } else if (stat.isFile()) {
        //判断是不是文件
        const paths = dir.split('/')
        const start = paths.indexOf(splitFirName)
        const iconName = paths.slice(start + 1, paths.length - 1).join('.')
        const name = path.parse(dir).name
        if (iconName) {
          icons.push(iconName + '/' + name)
        } else {
          icons.push(name)
        }
      }
    }
    getFiles('inertia/assets/icons', 'icons')
    return icons
  }

  public static async createMenu(data: MenuCreateReq) {
    const menu = await AdminMenu.create(data)
    menu.slug = `${menu.id}_${menu.parentId}`
    await menu.save()
    const casbinService = new CasbinService()
    if (menu.uri) {
      await casbinService.addMenuPolicy(menu.slug, menu.uri, 'GET')
    }
    if (data.permission) {
      await casbinService.addGroupingPolicy(data.permission, menu.slug)
    }
    if (data.roles && data.roles.length > 0) {
      for (const role of data.roles) {
        await casbinService.addGroupingPolicy(role, menu.slug)
      }
    }
    return true
  }

  public static async updateMenu(data: MenuUpdateReq) {
    const menu = await AdminMenu.query().where('id', data.id).first()
    if (!menu) return false
    const casbinService = new CasbinService()
    await casbinService.deleteMenuPolicy(menu.slug)
    await casbinService.deleteMenuPermissionAndRole(menu.slug)
    menu.icon = data.icon
    menu.order = data.order
    menu.parentId = data.parent_id
    menu.permission = data.permission || null
    menu.title = data.title
    menu.uri = data.uri
    menu.slug = `${menu.id}_${menu.parentId}`
    await menu.save()
    if (menu.uri) {
      await casbinService.addMenuPolicy(menu.slug, menu.uri, 'GET')
    }
    if (data.permission) {
      await casbinService.addGroupingPolicy(data.permission, menu.slug)
    }
    if (data.roles && data.roles.length > 0) {
      for (const role of data.roles) {
        await casbinService.addGroupingPolicy(role, menu.slug)
      }
    }
    return true
  }
}
