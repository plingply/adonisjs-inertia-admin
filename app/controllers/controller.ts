export default class Controller {
  public success(data: any = null) {
    return {
      code: 200,
      data,
    }
  }

  public error(message: string = '操作失败', code: number = 500) {
    return {
      code,
      message,
    }
  }
}
