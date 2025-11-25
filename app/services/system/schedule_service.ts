import AdminScheduler from '#models/system/admin_scheduler'
import { ScheduleCreateReq, ScheduleUpdateReq } from '#types/schedule'
import logger from '@adonisjs/core/services/logger'
import { DateTime } from 'luxon'
import pm2 from 'pm2'

export class ScheduleService {
  public static async getPage(page: number, limit: number, search: string, group: string) {
    const query = AdminScheduler.query().orderBy('id', 'asc')
    if (search) {
      query.where('name', 'like', `%${search}%`)
    }
    if (group) {
      query.where('group', group)
    }
    const res = await query.paginate(page, limit)
    return res
  }

  public static async create(data: ScheduleCreateReq) {
    const scheduler = new AdminScheduler()
    scheduler.merge(data)
    await scheduler.save()
    return true
  }

  public static async update(data: ScheduleUpdateReq) {
    const scheduler = await AdminScheduler.find(data.id)
    if (!scheduler) return false
    scheduler.merge(data)
    await scheduler.save()
    return true
  }

  public static async deleteById(id: number) {
    const scheduler = await AdminScheduler.find(id)
    if (!scheduler) return false
    await scheduler.delete()
    return true
  }

  public static async restartPm2(appName = 'all'): Promise<{ success: boolean; message: string }> {
    return new Promise((resolve, reject) => {
      pm2.connect(function (err) {
        if (err) {
          logger.error(err)
          pm2.disconnect()
          return reject(err)
        }

        pm2.restart(appName, function (err1) {
          if (err1) {
            logger.error(err1)
            pm2.disconnect()
            return reject(err)
          }
          pm2.disconnect()
          return resolve({ success: true, message: `Successfully restart ${appName}` })
        })
      })
    })
  }

  public static async stopPm2(appName = 'all'): Promise<{ success: boolean; message: string }> {
    return new Promise((resolve, reject) => {
      pm2.connect(function (err) {
        if (err) {
          logger.error(err)
          pm2.disconnect()
          return reject(err)
        }

        pm2.stop(appName, function (err1) {
          if (err1) {
            logger.error(err1)
            pm2.disconnect()
            return reject(err)
          }
          pm2.disconnect()
          return resolve({ success: true, message: `Successfully stopped ${appName}` })
        })
      })
    })
  }

  public static async pm2List(): Promise<
    {
      pid: number
      name: string
      status: string
      memory: number
      cpu: number
      instances: number
      created_at: string | null
      restart_time: number
      pm_uptime: string | null
    }[]
  > {
    return new Promise((resolve, reject) => {
      pm2.connect(function (err) {
        if (err) {
          logger.error(err)
          pm2.disconnect()
          return reject(err)
        }

        pm2.list(function (err1, list) {
          if (err1) {
            logger.error(err1)
            pm2.disconnect()
            return reject(err)
          }
          const apps = [] as any
          list.forEach((app) => {
            apps.push({
              pid: app.pid,
              name: app.name,
              status: app.pm2_env?.status,
              memory: app.monit?.memory,
              cpu: app.monit?.cpu,
              instances: app.pm2_env?.instances,
              created_at: app.pm2_env?.created_at
                ? DateTime.fromMillis(app.pm2_env.created_at).toFormat('yyyy-MM-dd HH:mm:ss')
                : null,
              restart_time: app.pm2_env?.restart_time,
              pm_uptime: app.pm2_env?.pm_uptime
                ? DateTime.fromMillis(app.pm2_env.pm_uptime).toFormat('yyyy-MM-dd HH:mm:ss')
                : null,
            })
          })
          pm2.disconnect()
          return resolve(apps)
        })
      })
    })
  }
}
