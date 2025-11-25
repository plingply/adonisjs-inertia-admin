import { schedulerGroup } from '#const/scheduler'
import env from '#start/env'
import { defineConfig } from 'adonisjs-jobs'

const queues = [env.get('REDIS_QUEUE', 'default'), ...schedulerGroup.map((item) => item.value)]
const jobsConfig = defineConfig({
  connection: {
    host: env.get('REDIS_HOST', 'localhost'),
    port: env.get('REDIS_PORT', 6379),
    password: env.get('REDIS_PASSWORD'),
    db: Number(env.get('REDIS_JOB_DB', '2')),
  },

  queue: env.get('REDIS_QUEUE', 'default'),

  queues: [...new Set(queues)],

  options: {
    /**
     * The total number of attempts to try the job until it completes.
     */
    attempts: 0,

    /**
     * Backoff setting for automatic retries if the job fails
     */
    backoff: {
      type: 'exponential',
      delay: 5000,
    },

    /**
     * If true, removes the job when it successfully completes
     * When given a number, it specifies the maximum amount of
     * jobs to keep, or you can provide an object specifying max
     * age and/or count to keep. It overrides whatever setting is used in the worker.
     * Default behavior is to keep the job in the completed set.
     */
    removeOnComplete: 1000,

    /**
     * If true, removes the job when it fails after all attempts.
     * When given a number, it specifies the maximum amount of
     * jobs to keep, or you can provide an object specifying max
     * age and/or count to keep. It overrides whatever setting is used in the worker.
     * Default behavior is to keep the job in the failed set.
     */
    removeOnFail: 1000,
  },
})

export default jobsConfig
