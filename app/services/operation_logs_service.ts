import AdminOperationLog from '#models/admin_operation_log'

export class OperationLogsService {
  public static async getPage(page: number, limit: number, search: string) {
    const query = AdminOperationLog.query().preload('user').orderBy('created_at', 'desc')
    if (search) {
      query
        .where('path', 'like', `%${search}%`)
        .orWhere('method', 'like', `%${search}%`)
        .orWhere('input', 'like', `%${search}%`)
    }
    const res = await query.paginate(page, limit)
    return res
  }
}
