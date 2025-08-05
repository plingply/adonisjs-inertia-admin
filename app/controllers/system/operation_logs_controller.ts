import { HttpContext } from '@adonisjs/core/http'
import Controller from '../controller.js'
import { paginate } from '../../utils/index.js'
import { OperationLogsService } from '#services/operation_logs_service'

export default class OperationLogsController extends Controller {
  public async index({ request, inertia }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)
    const search = request.input('search', '')
    const logs = await OperationLogsService.getPage(page, limit, search)
    const data = paginate(logs)
    return inertia.render('operationLogs/index', {
      list: data.item,
      total: data.total,
    })
  }

  public async list({ request }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)
    const search = request.input('search', '')
    const roles = await OperationLogsService.getPage(page, limit, search)
    const data = paginate(roles)
    return this.success(data)
  }
}
