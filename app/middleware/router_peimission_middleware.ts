import AdminPermission from '#models/system/admin_permission'
import { AuthService } from '#services/system/auth_service'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { matchRoute } from '../utils/index.js'
import { MenuService } from '#services/system/menu_service'
import CasbinService from '#services/casbin_service'

/**
 * Silent auth middleware can be used as a global middleware to silent check
 * if the user is logged-in or not.
 *
 * The request continues as usual, even when the user is not logged-in.
 */
export default class RouterPeimissionMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    if (MenuService.isPublicRoute(ctx.request.url(false))) return next()
    const user = ctx.auth.user
    if (!user) return ctx.response.redirect('/login', true)
    if (user.isAdmin()) return next()
    const casbinService = new CasbinService()
    const permission = await casbinService.checkPermission(
      user.username,
      ctx.request.url(false),
      ctx.request.method()
    )
    console.log(
      'permission: ',
      permission,
      user.username,
      ctx.request.url(false),
      ctx.request.method()
    )
    if (!permission) return ctx.response.redirect('/no-permission', true)
    return next()
  }
}
