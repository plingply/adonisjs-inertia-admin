import env from '#start/env'
import app from '@adonisjs/core/services/app'
import { defineConfig, targets } from '@adonisjs/core/logger'

const loggerConfig = defineConfig({
  default: 'app',

  /**
   * The loggers object can be used to define multiple loggers.
   * By default, we configure only one logger (named "app").
   */
  loggers: {
    app: {
      enabled: true,
      name: env.get('APP_NAME'),
      level: env.get('LOG_LEVEL'),
      timestamp: () => {
        function padZero(num: number): string {
          return num.toString().padStart(2, '0')
        }
        let time = new Date(new Date().toUTCString())
        time.setHours(time.getHours() + 8)
        const year = time.getFullYear()
        const month = padZero(time.getMonth() + 1) // 月份从0开始，需要+1
        const day = padZero(time.getDate())
        const hours = padZero(time.getHours())
        const minutes = padZero(time.getMinutes())
        const seconds = padZero(time.getSeconds())
        return `,"time":"${year}-${month}-${day} ${hours}:${minutes}:${seconds}"`
      },
      transport: {
        targets: targets()
          .push({
            target: 'pino-roll',
            level: 'info',
            options: {
              file: env.get('LOG_FILE'),
              frequency: 'daily',
              mkdir: true,
            },
          })
          .pushIf(!app.inProduction, targets.pretty())
          .pushIf(app.inProduction, targets.file({ destination: 1 }))
          .toArray(),
      },
    },
  },
})

export default loggerConfig

/**
 * Inferring types for the list of loggers you have configured
 * in your application.
 */
declare module '@adonisjs/core/types' {
  export interface LoggersList extends InferLoggers<typeof loggerConfig> {}
}
