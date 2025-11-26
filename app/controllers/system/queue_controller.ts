import { HttpContext } from '@adonisjs/core/http'
import Controller from '../controller.js'
import { QueueService } from '#services/system/queue_service'

export default class QueueController extends Controller {
  public async index({ inertia }: HttpContext) {
    return inertia.render('settings/queue/index')
  }

  public async overview() {
    const queues = await QueueService.getQueue()
    return this.success(queues)
  }

  public async jobs({ request }: HttpContext) {
    const queueName = request.input('queueName')
    const status = request.input('status')
    const page = request.input('page', 1)
    if (!queueName || !status) return this.error('参数错误')
    const list = await QueueService.jobs(queueName, status, page)
    return this.success(list)
  }

  public async jobRestart({ request }: HttpContext) {
    const key = request.input('key')
    if (!key) return this.error('参数错误')
    const res = await QueueService.jobRestart(key)
    if (res.success) {
      return this.success(res.message)
    }
    return this.error(res.message)
  }

  public async jobDelete({ request }: HttpContext) {
    const key = request.input('key')
    if (!key) return this.error('参数错误')
    const res = await QueueService.jobDelete(key)
    if (res.success) {
      return this.success(res.message)
    }
    return this.error(res.message)
  }
}
