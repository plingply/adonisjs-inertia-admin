import { Job } from 'adonisjs-jobs'

type TestPayload = {
  message: string
}

export default class TestJob extends Job {
  async handle(payload: TestPayload) {
    this.logger.info(payload.message)
  }

  sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time))
  }
}
