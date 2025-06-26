import { MenuService } from '#services/menu_service'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

/**
 * Silent auth middleware can be used as a global middleware to silent check
 * if the user is logged-in or not.
 *
 * The request continues as usual, even when the user is not logged-in.
 */
export default class ShareDataMiddleware {
  async handle({ inertia, auth }: HttpContext, next: NextFn) {
    let myMenus = []
    if (auth.user) {
      myMenus = await MenuService.getMyMenuTree(auth.user)
    }
    inertia.share({
      myMenus: myMenus,
    })
    return next()
  }
}
