import AdminScheduler from '#models/system/admin_scheduler'
import scheduler from 'adonisjs-scheduler/services/main'

async function init() {
  const list = await AdminScheduler.query().where('is_active', 1)
  list.forEach(async (sch: AdminScheduler) => {
    const args = sch.args ? JSON.parse(sch.args) : []
    scheduler.command(sch.command, args).cron(sch.cron)
  })
}

init()
