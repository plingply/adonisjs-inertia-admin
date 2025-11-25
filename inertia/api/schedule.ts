import axios from 'axios'
export async function getSchedulePage(params: any) {
  return axios.get('/api/schedule/list', {
    params,
  })
}
export async function delScheduleById(id: number) {
  return axios.post('/api/schedule/delete', { id })
}
export async function createSchedule(data: any) {
  return axios.post('/api/schedule/create', data)
}
export async function updateSchedule(data: any) {
  return axios.post('/api/schedule/update', data)
}

export async function refreshPM2List() {
  return axios.post('/api/schedule/refresh/pm2')
}

export async function restartPM2App(appName = 'all') {
  return axios.post('/api/schedule/restart/pm2', {
    appName,
  })
}

export async function stopPM2App(appName = 'all') {
  return axios.post('/api/schedule/stop/pm2', {
    appName,
  })
}

export const executeScheduleNow = (id: number) => {
  return axios.post(`/api/schedule/${id}/execute`)
}
