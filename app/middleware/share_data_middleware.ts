import AdminMenu from '#models/admin_menu'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

/**
 * Silent auth middleware can be used as a global middleware to silent check
 * if the user is logged-in or not.
 *
 * The request continues as usual, even when the user is not logged-in.
 */
export default class ShareDataMiddleware {
  async handle({ inertia }: HttpContext, next: NextFn) {
    const menus = await AdminMenu.query()
    inertia.share({
      menus: menus,
    })
    return next()
  }
}
