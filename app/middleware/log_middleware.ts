import AdminOperationLog from '#models/admin_operation_log'
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
    if (ctx.request.url().includes('operation_logs')) return next()
    const model = new AdminOperationLog()
    model.userId = ctx.auth.user?.id || 0
    model.method = ctx.request.method()
    model.path = ctx.request.url(true)
    model.ip = ctx.request.ip()
    model.input = JSON.stringify(ctx.request.body())
    model.save()
    return next()
  }
}
