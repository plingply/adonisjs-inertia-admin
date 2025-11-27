import AdminScheduler from '#models/system/admin_scheduler'
import logger from '@adonisjs/core/services/logger'
import scheduler from 'adonisjs-scheduler/services/main'

async function init() {
  const list = await AdminScheduler.query().where('is_active', 1)
  logger.info('init scheduler' + list.length)
  list.forEach(async (sch: AdminScheduler) => {
    const args = sch.args || []
    scheduler.command(sch.command, args).cron(sch.cron)
  })
}

init()
