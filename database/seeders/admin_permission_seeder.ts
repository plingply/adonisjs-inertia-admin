import AdminPermission from '#models/system/admin_permission'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await AdminPermission.updateOrCreateMany(
      ['id'],
      [
        {
          id: 1,
          name: '基础权限',
          slug: 'base_permission',
          permissions: JSON.stringify([
            {
              http_path: '/',
              http_method: ['GET'],
            },
          ]),
        },
        {
          id: 2,
          name: '系统设置',
          slug: 'settins',
        },
        {
          id: 3,
          name: '菜单设置',
          slug: 'menu',
          permissions: JSON.stringify([
            {
              http_path: '/settings/menu',
              http_method: ['GET'],
            },
            {
              http_path: '/api/menu/*',
              http_method: ['POST', 'GET'],
            },
          ]),
        },
        {
          id: 4,
          name: '角色管理',
          slug: 'role',
          permissions: JSON.stringify([
            {
              http_path: '/settings/role',
              http_method: ['GET'],
            },
            {
              http_path: '/api/role/*',
              http_method: ['GET', 'POST'],
            },
          ]),
        },
        {
          id: 5,
          name: '权限设置',
          slug: 'permission',
          permissions: JSON.stringify([
            {
              http_path: '/settings/permission',
              http_method: ['GET'],
            },
            {
              http_path: '/api/permission/*',
              http_method: ['POST', 'GET'],
            },
          ]),
        },
        {
          id: 6,
          name: '用户管理',
          slug: 'user',
          permissions: JSON.stringify([
            {
              http_path: '/settings/user',
              http_method: ['GET'],
            },
            {
              http_path: '/api/user/*',
              http_method: ['POST', 'GET'],
            },
          ]),
        },
        {
          id: 7,
          name: '日志管理',
          slug: 'logs',
          permissions: JSON.stringify([
            {
              http_path: '/settings/operation_logs',
              http_method: ['GET'],
            },
            {
              http_path: '/api/operation_logs/*',
              http_method: ['POST', 'GET'],
            },
          ]),
        },
        {
          id: 8,
          name: '定时任务',
          slug: 'schedule',
          permissions: JSON.stringify([
            {
              http_path: '/settings/schedule',
              http_method: ['GET'],
            },
            {
              http_path: '/api/schedule/*',
              http_method: ['POST', 'GET'],
            },
          ]),
        },
        {
          id: 9,
          name: '队列管理',
          slug: 'queue',
          permissions: JSON.stringify([
            {
              http_path: '/settings/queue',
              http_method: ['GET'],
            },
            {
              http_path: '/api/queue/*',
              http_method: ['POST', 'GET'],
            },
          ]),
        },
      ]
    )
  }
}
