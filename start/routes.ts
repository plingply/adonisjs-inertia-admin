/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
import AdminUser from '#models/system/admin_user'
import CasbinService from '#services/casbin_service'
import AdminMenu from '#models/system/admin_menu'
import { MenuService } from '#services/system/menu_service'
const AuthController = () => import('#controllers/system/auth_controller')
const MenuController = () => import('#controllers/system/menu_controller')
const RoleController = () => import('#controllers/system/role_controller')
const PeimissionController = () => import('#controllers/system/peimission_controller')
const UserController = () => import('#controllers/system/user_controller')
const OperationLogsController = () => import('#controllers/system/operation_logs_controller')

router.on('/login').renderInertia('auth/login').use(middleware.guest())
router.get('/test', async () => {
  //  const casbinService = new CasbinService()
  // return {
  //   data: await casbinService.deleteMenuPolicy()
  // }
  // const user = await AdminMenu.query()
  //   .preload('roles')
  // return {
  //   data: user,
  // }
  const casbinService = new CasbinService()
  // const p = await casbinService.checkPermission('user2', '/settings', 'GET')
  // const p = await casbinService.addPolicy('permission1', '/logs', 'GET')
  const p = await casbinService.deleteRole('role1')
  // const menu = await MenuService.getUserMenuTree('createUser')
  return {
    data: p,
  }
  // const enforcer = await casbinService.getEnforcer()
  // const p = await enforcer.getFilteredNamedGroupingPolicy('g2', 0, '13')
  // p.forEach((item) => {
  //   console.log(item)
  // })
  // for (const item of p) {
  //   await enforcer.removeNamedGroupingPolicy('g2', item[0], item[1])
  // }
  // const res = await enforcer.removeNamedGroupingPolicy('g2', '13')
  // const res = await casbinService.checkPermission('13', '/users', 'GET')
  return {
    data: p,
  }
  // const res = await enforcer.getPermissionsForUser('alice')
  // const res = await enforcer.getRolesForUser('alice')
  // const res = await enforcer.addGroupingPolicy('penglin', 'admin')
  // await enforcer.addPolicy('permission_1', '/users', 'GET')
  // await enforcer.addPolicy('permission_2', '/info', 'GET')
  // await enforcer.addPolicy('user1', '/create', 'POST')

  // await enforcer.addGroupingPolicy('roles', 'permission_1')
  // await enforcer.addGroupingPolicy('user1', 'roles')
  // await enforcer.addGroupingPolicy('user1', 'permission_2')
  // const res = await casbinService.checkPermission('user1', '/users', 'GET')
  // const roles = await enforcer.getRolesForUser('user1')
  // const permissions = await enforcer.getPermissionsForUser('user1')
  // const rolesPermissions = await enforcer.getRolesForUser('roles')
  // return {
  //   data: {
  //     hasPermission: res,
  //     roles,
  //     permissions,
  //     rolesPermissions,
  //   },
  // }
})

router
  .group(() => {
    router.get('/', [MenuController, 'index'])
    router.on('/no-permission').renderInertia('errors/no_permission')
    router
      .group(() => {
        router.get('/menu', [MenuController, 'index'])
        router.get('/role', [RoleController, 'index'])
        router.get('/peimission', [PeimissionController, 'index'])
        router.get('/user', [UserController, 'index'])
        router.get('/operation_logs', [OperationLogsController, 'index'])
      })
      .prefix('/settings')
  })
  .use(middleware.auth())
  .use(middleware.log())
  .use(middleware.rotuePermission())
  .use(middleware.shareData())

// api
router
  .group(() => {
    router.post('/login', [AuthController, 'login']).use(middleware.log())
    router
      .group(() => {
        router.get('/menu/tree', [MenuController, 'menuTree'])
        router.post('/menu/save/all', [MenuController, 'saveMenuAll'])
        router.post('/menu/del', [MenuController, 'delMenuById'])
        router.post('/menu/create', [MenuController, 'create'])
        router.post('/menu/update', [MenuController, 'update'])

        router.get('/role/list', [RoleController, 'list'])
        router.post('/role/update', [RoleController, 'update'])
        router.post('/role/delete', [RoleController, 'delete'])
        router.post('/role/create', [RoleController, 'create'])

        router.get('/permission/list', [PeimissionController, 'list'])
        router.post('/permission/update', [PeimissionController, 'update'])
        router.post('/permission/delete', [PeimissionController, 'delete'])
        router.post('/permission/create', [PeimissionController, 'create'])

        router.get('/user/list', [UserController, 'list'])
        router.post('/user/update', [UserController, 'update'])
        router.post('/user/delete', [UserController, 'delete'])
        router.post('/user/create', [UserController, 'create'])

        router.get('/operation_logs/list', [OperationLogsController, 'list'])
      })
      .use(middleware.auth())
      .use(middleware.log())
      .use(middleware.rotuePermission())
  })
  .prefix('/api')
