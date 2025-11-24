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

const AuthController = () => import('#controllers/system/auth_controller')
const IndexController = () => import('#controllers/index_controller')
const MenuController = () => import('#controllers/system/menu_controller')
const RoleController = () => import('#controllers/system/role_controller')
const PeimissionController = () => import('#controllers/system/peimission_controller')
const UserController = () => import('#controllers/system/user_controller')
const OperationLogsController = () => import('#controllers/system/operation_logs_controller')

router.get('/test', async ({ response }) => {
  // const user = await AdminUser.withTrashed().where('id', 1).first()
  // return user
  // const user = await AdminUser.query().with

  const user = await AdminUser.onlyTrashed().restore()
  // await AdminRole.query().withTrashed().where('id', 1).restore()
  return user
})

router.on('/login').renderInertia('auth/login').use(middleware.guest())
router
  .group(() => {
    router.on('/no-permission').renderInertia('errors/no_permission')
    router.get('/', [IndexController, 'index'])
    router.get('/logout', [AuthController, 'logout'])
    router
      .group(() => {
        router.get('/menu', [MenuController, 'index'])
        router.get('/role', [RoleController, 'index'])
        router.get('/peimission', [PeimissionController, 'index'])
        router.get('/user', [UserController, 'index'])
        router.get('/operation_logs', [OperationLogsController, 'index'])
      })
      .use(middleware.rotuePermission())
      .prefix('/settings')
  })
  .use(middleware.auth())
  .use(middleware.log())
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
