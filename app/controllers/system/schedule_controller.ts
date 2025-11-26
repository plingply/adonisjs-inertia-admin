import { HttpContext } from '@adonisjs/core/http'
import Controller from '../controller.js'
import { paginate } from '#utils/index'
import { ScheduleService } from '#services/system/schedule_service'
import {
  CreateScheduleValidator,
  DeleteScheduleValidator,
  UpdateScheduleValidator,
} from '#validators/schedule'
import { schedulerGroup } from '#const/scheduler'

import apps from '../../../config/ecosystem.config.cjs'

export default class ScheduleController extends Controller {
  public async index({ request, inertia }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)
    const search = request.input('search', '')
    const group = request.input('group', '')
    const roles = await ScheduleService.getPage(page, limit, search, group)
    const data = paginate(roles)
    const pm2List = await ScheduleService.pm2List()
    return inertia.render('settings/schedule/index', {
      list: data.item,
      total: data.total,
      groups: schedulerGroup,
      search: search,
      apps: apps.apps,
      pm2List: pm2List,
    })
  }

  public async list({ request }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)
    const search = request.input('search', '')
    const group = request.input('group', '')
    const roles = await ScheduleService.getPage(page, limit, search, group)
    const data = paginate(roles)
    return this.success(data)
  }

  public async delete({ request }: HttpContext) {
    const payload = await DeleteScheduleValidator.validate(request.all())
    const res = await ScheduleService.deleteById(payload.id)
    if (!res) return this.error('删除失败')
    const msg = await ScheduleService.restartPm2()
    return this.success(msg.message)
  }

  public async create({ request }: HttpContext) {
    const payload = await CreateScheduleValidator.validate(request.all())
    const res = await ScheduleService.create(payload)
    if (!res) return this.error('创建失败')
    const msg = await ScheduleService.restartPm2()
    return this.success(msg.message)
  }

  public async update({ request }: HttpContext) {
    const payload = await UpdateScheduleValidator.validate(request.all())
    const res = await ScheduleService.update(payload)
    if (!res) return this.error('更新失败')
    const msg = await ScheduleService.restartPm2()
    return this.success(msg.message)
  }

  public async refreshPM2List() {
    const data = await ScheduleService.pm2List()
    return this.success(data)
  }

  public async restartPM2List({ request }: HttpContext) {
    const appName = request.input('appName')
    if (!appName) return this.error('请选择要重启的进程')
    const data = await ScheduleService.restartPm2(appName)
    return this.success(data)
  }

  public async stopPM2List({ request }: HttpContext) {
    const appName = request.input('appName')
    if (!appName) return this.error('请选择要重启的进程')
    const data = await ScheduleService.stopPm2(appName)
    return this.success(data)
  }

  public async executeNow({ request }: HttpContext) {
    const id = request.param('id')
    if (!id) return this.error('参数错误')
    const data = await ScheduleService.executeNow(id)
    if (data.success) {
      return this.success(data)
    }
    return this.error(data.message)
  }
}
