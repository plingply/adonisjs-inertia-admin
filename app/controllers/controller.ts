export default class Controller {
  public success(data: any = null, message: string = '操作成功') {
    return {
      code: 200,
      data,
      message,
    }
  }

  public error(message: string = '操作失败', code: number = 500) {
    return {
      code,
      message,
    }
  }
}
