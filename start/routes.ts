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
import AdminRole from '#models/admin_role'
const AuthController = () => import('#controllers/auth_controller')
const MenuController = () => import('#controllers/menu_controller')
const RoleController = () => import('#controllers/role_controller')
const PeimissionController = () => import('#controllers/peimission_controller')
const UserController = () => import('#controllers/user_controller')
const OperationLogsController = () => import('#controllers/operation_logs_controller')

router.on('/login').renderInertia('auth/login').use(middleware.guest())
router.get('/test', async () => {
  return AdminRole.all()
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
      })
      .use(middleware.auth())
      .use(middleware.log())
      .use(middleware.rotuePermission())
  })
  .prefix('/api')
