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
const AuthController = () => import('#controllers/auth_controller')

router.on('/').renderInertia('home').use(middleware.auth())
router.on('/login').renderInertia('auth/login').use(middleware.guest())
router
  .group(() => {
    router.post('/login', [AuthController, 'login'])
  })
  .prefix('/api')
