import AdminMenu from '#models/system/admin_menu'
import AdminRoleMenu from '#models/system/admin_role_menu'
import AdminUser from '#models/system/admin_user'
import { handleTree } from '../../utils/index.js'
import fs from 'node:fs'
import path from 'node:path'
import { AuthService } from './auth_service.js'
import { MenuItem } from '../../types/menu.js'

export class MenuService {
  public static publicMenus = ['/login', '/api/login', '/no-permission']

  public static isPublicRoute(url: string) {
    return this.publicMenus.includes(url)
  }
  public static async getMyMenuTree(user: AdminUser) {
    const menuTree = await this.getAllMenuToTree()
    if (AuthService.isAdmin(user)) {
      return menuTree
    }
    const roleIds: number[] = user.roles?.map((item) => item.id) || []
    const permissions = user.allPermissions
    const hasAllPermissions = AuthService.hasAllPermissions(user)
    function loop(menuArray: MenuItem[]) {
      menuArray.forEach((item) => {
        if (item.roles && item.roles.length > 0) {
          item.hasRole = !!item.roles.find((role) => roleIds.includes(role.id))
        } else {
          item.hasPermission =
            hasAllPermissions ||
            item.permission === '*' ||
            !item.permission ||
            permissions.includes(item.permission)
          if (item.children && item.children.length > 0) {
            loop(item.children)
          }
        }
        return item
      })
    }

    function filterMenu(tree: MenuItem[]) {
      tree = tree.filter((item) => {
        if (Object.keys(item).includes('hasRole')) {
          return item.hasRole
        } else if (Object.keys(item).includes('hasPermission')) {
          if (item.children && item.children.length > 0) {
            item.children = filterMenu(item.children)
          }
          return item.hasPermission
        } else {
          return true
        }
      })
      return tree
    }

    loop(menuTree)

    return filterMenu(menuTree)
  }

  public static async getAllMenuToTree() {
    const menus = await AdminMenu.query().preload('roles').orderBy('order', 'asc')
    const menuArray = menus.map((item) => item.serialize())
    return handleTree(menuArray, 'id', 'parent_id', 'children')
  }

  public static async saveMenuAll(menus: any[]) {
    await AdminMenu.query().delete()
    await AdminMenu.updateOrCreateMany(['id'], menus)
    return true
  }

  public static async delMenuById(id: number) {
    const tree = await this.getAllMenuToTree()
    const ids = this.findChildrenIdsForTreeById(tree, id)
    await AdminMenu.query().whereIn('id', ids).delete()
    await AdminRoleMenu.query().whereIn('menuId', ids).delete()
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

  public static async createMenu(data: any) {
    const menu = await AdminMenu.create(data)
    menu.related('roles').sync(data.roles)
    return true
  }

  public static async updateMenu(data: any) {
    const menu = await AdminMenu.query().preload('roles').where('id', data.id).first()
    if (!menu) return false
    menu.merge(data)
    await menu.save()
    menu.related('roles').sync(data.roles)
    return true
  }
}
