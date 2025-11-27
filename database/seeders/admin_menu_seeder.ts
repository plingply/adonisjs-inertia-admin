import AdminMenu from '#models/system/admin_menu'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await AdminMenu.updateOrCreateMany(
      ['id'],
      [
        {
          id: 1,
          parentId: 0,
          title: '首页',
          icon: 'HomeFilled',
          uri: '/',
          permission: null,
          order: 1,
        },
        {
          id: 2,
          parentId: 0,
          title: '系统管理',
          icon: 'Tools',
          uri: '/system',
          permission: null,
          order: 99,
        },
        {
          id: 3,
          parentId: 2,
          title: '菜单设置',
          icon: 'Menu',
          uri: '/settings/menu',
          permission: 'menu',
          order: 1,
        },
        {
          id: 4,
          parentId: 2,
          title: '用户设置',
          icon: 'Avatar',
          uri: '/settings/user',
          permission: 'user',
          order: 2,
        },
        {
          id: 5,
          parentId: 2,
          title: '权限设置',
          icon: 'UserFilled',
          uri: '/settings/peimission',
          permission: 'peimission',
          order: 3,
        },
        {
          id: 6,
          parentId: 2,
          title: '角色设置',
          icon: 'Flag',
          uri: '/settings/role',
          permission: 'role',
          order: 4,
        },
        {
          id: 7,
          parentId: 2,
          title: '日志',
          icon: 'InfoFilled',
          uri: '/settings/operation_logs',
          permission: 'logs',
          order: 5,
        },
        {
          id: 8,
          parentId: 2,
          title: '定时任务',
          icon: 'Opportunity',
          uri: '/settings/schedule',
          permission: 'schedule',
          order: 6,
        },
        {
          id: 9,
          parentId: 2,
          title: '队列任务',
          icon: 'Platform',
          uri: '/settings/queue',
          permission: 'queue',
          order: 7,
        },
      ]
    )
  }
}
