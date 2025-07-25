import AdminPermission from '#models/admin_permission'
import { AuthService } from '#services/auth_service'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { matchRoute } from '../utils/index.js'
import { MenuService } from '#services/menu_service'

/**
 * Silent auth middleware can be used as a global middleware to silent check
 * if the user is logged-in or not.
 *
 * The request continues as usual, even when the user is not logged-in.
 */
export default class RouterPeimissionMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    if (MenuService.isPublicRoute(ctx.request.url())) return next()
    const user = ctx.auth.user
    if (!user) return ctx.response.redirect('/login', true)
    if (AuthService.hasAllPermissions(user)) return next()
    const permissions = await AdminPermission.query().whereIn('slug', user.allPermissions)
    const routers = [] as { method: string; path: string }[]
    permissions.forEach((item) => {
      if (item.httpPath) {
        const httpPath = item.httpPath.split('\n')
        httpPath.forEach((url) => {
          routers.push({
            method: item.httpMethod || '*',
            path: url.trim(),
          })
        })
      }
    })
    for (let router of routers) {
      if (
        matchRoute(router.path, ctx.request.url()) &&
        matchRoute(router.method, ctx.request.method())
      ) {
        return next()
      }
    }
    return ctx.response.redirect('/no-permission', true)
  }
}
