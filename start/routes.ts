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
import { MenuService } from '#services/menu_service'
import { AuthService } from '#services/auth_service'
import AdminUser from '#models/admin_user'
const AuthController = () => import('#controllers/auth_controller')
const MenuController = () => import('#controllers/menu_controller')

router.on('/login').renderInertia('auth/login').use(middleware.guest())
router.get('/test', async () => {
  const user = await AdminUser.query()
    .preload('roles', (query) => {
      query.preload('permissions')
    })
    .preload('permissions')
    .where('id', 1)
    .first()
  if (!user) return 'empty'
  return await MenuService.getMyMenuTree(user)
})

router
  .group(() => {
    router.on('/').renderInertia('home')
    router
      .group(() => {
        router.get('/menu', [MenuController, 'index'])
      })
      .prefix('/settings')
  })
  .use(middleware.auth())
  .use(middleware.shareData())

// api
router
  .group(() => {
    router.post('/login', [AuthController, 'login'])
    router
      .group(() => {
        router.get('/menu/tree', [MenuController, 'menuTree'])
        router.post('/menu/save/all', [MenuController, 'saveMenuAll'])
        router.post('/menu/del', [MenuController, 'delMenuById'])
        router.post('/menu/create', [MenuController, 'create'])
        router.post('/menu/update', [MenuController, 'update'])
      })
      .use(middleware.auth())
  })
  .prefix('/api')
