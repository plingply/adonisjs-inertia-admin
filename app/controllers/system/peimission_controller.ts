import { HttpContext } from '@adonisjs/core/http'
import Controller from '../controller.js'
import { paginate } from '../../utils/index.js'
import { PeimissionService } from '#services/peimission_service'

export default class PeimissionController extends Controller {
  public async index({ request, inertia }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)
    const search = request.input('search', '')
    const peimissions = await PeimissionService.getPeimissionPage(page, limit, search)
    const data = paginate(peimissions)
    return inertia.render('peimission/index', {
      peimissions: data.item,
      total: data.total,
    })
  }

  public async list({ request }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)
    const search = request.input('search', '')
    const peimissions = await PeimissionService.getPeimissionPage(page, limit, search)
    const data = paginate(peimissions)
    return this.success(data)
  }

  public async delete({ request }: HttpContext) {
    const id = request.input('id')
    const res = await PeimissionService.deletePeimissionById(id)
    if (!res) return this.error('删除失败')
    return this.success()
  }

  public async update({ request }: HttpContext) {
    const data = request.all()
    const res = await PeimissionService.updatePeimission(data)
    if (!res) return this.error('更新失败')
    return this.success()
  }

  public async create({ request }: HttpContext) {
    const data = request.all()
    delete data.id
    const res = await PeimissionService.createPeimission(data)
    if (!res) return this.error('创建失败')
    return this.success()
  }
}
