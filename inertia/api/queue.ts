import axios from 'axios'
export async function getQueueOverview() {
  return axios.get('/api/queue/overview')
}

export async function getQueueJobs(queueName: string, status: string, page = 1) {
  return axios.get('/api/queue/jobs', {
    params: {
      queueName,
      status,
      page,
    },
  })
}
export async function jobRestart(key: string) {
  return axios.post('/api/queue/job/restart', {
    key,
  })
}

export async function deleteJobByKey(key: string) {
  return axios.post('/api/queue/job/delete', {
    key,
  })
}
