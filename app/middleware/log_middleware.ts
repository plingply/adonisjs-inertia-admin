import { HttpContext } from '@adonisjs/core/http'
import { NextFn } from '@adonisjs/core/types/http'

/**
 * The container bindings middleware binds classes to their request
 * specific value using the container resolver.
 *
 * - We bind "HttpContext" class to the "ctx" object
 * - And bind "Logger" class to the "ctx.logger" object
 */
export default class LogMiddleware {
  handle(ctx: HttpContext, next: NextFn) {
    ctx.logger.info(
      'method: ' +
        ctx.request.method() +
        ' url:' +
        ctx.request.url() +
        ' request:' +
        JSON.stringify(ctx.request.all())
    )
    return next()
  }
}
