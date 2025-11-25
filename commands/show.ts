import TestJob from '#jobs/test_job'
import { BaseCommand, flags } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'

export default class Show extends BaseCommand {
  static commandName = 'show'
  static description = ''

  static options: CommandOptions = {
    startApp: false,
    staysAlive: false,
  }

  @flags.string({
    description: '队列名称',
    required: false,
  })
  declare queue: string

  async run() {
    TestJob.dispatch(
      {
        message: 'Hello world from "Test"',
      },
      {
        queueName: this.queue || 'default',
      }
    )
  }
}
