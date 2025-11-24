import type { ApplicationService } from '@adonisjs/core/types'
import { DatabaseQueryBuilder } from '@adonisjs/lucid/database'
import { ModelQueryBuilder } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export default class AppProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * Register bindings to the container
   */
  register() {}

  /**
   * The container bindings have booted
   */
  async boot() {
    ModelQueryBuilder.macro('getCount', async function (): Promise<number> {
      // @ts-ignore
      const result = await this.count('* as total')
      return Number(result[0].$extras.total)
    })
    DatabaseQueryBuilder.macro('getCount', async function (): Promise<number> {
      // @ts-ignore
      const result = await this.count('* as total')
      return Number(result[0].total)
    })
    ModelQueryBuilder.macro('deleteSoft', async function (): Promise<void> {
      // @ts-ignore
      await this.update({ deleted_at: new Date() })
    })
    DatabaseQueryBuilder.macro('deleteSoft', async function (): Promise<void> {
      // @ts-ignore
      await this.update({ deleted_at: new Date() })
    })
    ModelQueryBuilder.macro('restore', async function (): Promise<void> {
      // @ts-ignore
      await this.update({ updated_at: new Date(), deleted_at: null })
    })
    DatabaseQueryBuilder.macro('restore', async function (): Promise<void> {
      // @ts-ignore
      await this.update({ updated_at: new Date(), deleted_at: null })
    })
  }

  /**
   * The application has been booted
   */
  async start() {}

  /**
   * The process has been started
   */
  async ready() {}

  /**
   * Preparing to shutdown the app
   */
  async shutdown() {}
}
