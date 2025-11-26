import env from '#start/env'
import redis from '@adonisjs/redis/services/main'
import { Queue } from 'bullmq'

export class QueueService {
  public static async getQueue() {
    await redis.select(env.get('REDIS_JOB_DB', '0'))
    const list = await redis.keys('bull:*:meta')
    const result: any[] = []
    for (const key of list) {
      const name = key.split(':')[1]
      const jobs = await redis.get(`bull:${name}:id`)
      result.push({
        key,
        name: name,
        meta: await redis.hgetall(key),
        jobs: Number(jobs),
        jobs_completed: await redis.zcard(`bull:${name}:completed`),
        jobs_failed: await redis.zcard(`bull:${name}:failed`),
        jobs_wait: await redis.llen(`bull:${name}:wait`),
        jobs_active: await redis.llen(`bull:${name}:active`),
      })
    }
    return result
  }

  public static async jobs(queueName: string, status: string, page: number = 1) {
    await redis.select(env.get('REDIS_JOB_DB', '0'))
    const key = `bull:${queueName}:${status}`
    const offset = (page - 1) * 10
    let list = []
    if (status === 'wait' || status === 'active') {
      list = await redis.lrange(key, offset, offset + 10)
    } else {
      list = await redis.zrange(key, offset, offset + 10)
    }
    const result = []
    for (const id of list) {
      const job = await redis.hgetall(`bull:${queueName}:${id}`)
      job.key = `bull:${queueName}:${id}`
      result.push(job)
    }
    return result
  }

  public static async jobRestart(key: string) {
    await redis.select(env.get('REDIS_JOB_DB', '0'))
    const queue = new Queue('user', {
      connection: {
        host: env.get('REDIS_HOST', '127.0.0.1'),
        port: Number(env.get('REDIS_PORT', '6379')),
        db: Number(env.get('REDIS_JOB_DB', '0')),
      },
    })
    const id = key.split(':')[2]
    const job = await queue.getJob(id)

    if (job) {
      try {
        await job.retry()
        await queue.disconnect()
        return {
          message: `Job ${key} 已重新排队等待重试`,
          success: true,
        }
      } catch (error) {
        await queue.disconnect()
        return {
          message: error.message,
          success: false,
        }
      }
    } else {
      await queue.disconnect()
      return {
        message: `未找到任务 ${key}`,
        success: false,
      }
    }
  }

  public static async jobDelete(key: string) {
    await redis.select(env.get('REDIS_JOB_DB', '0'))
    const queue = new Queue('user', {
      connection: {
        host: env.get('REDIS_HOST', '127.0.0.1'),
        port: Number(env.get('REDIS_PORT', '6379')),
        db: Number(env.get('REDIS_JOB_DB', '0')),
      },
    })
    try {
      const id = key.split(':')[2]
      await queue.remove(id)
      await queue.disconnect()
      return {
        message: `任务 ${key} 已删除`,
        success: true,
      }
    } catch (error) {
      await queue.disconnect()
      return {
        message: error.message,
        success: false,
      }
    }
  }
}
