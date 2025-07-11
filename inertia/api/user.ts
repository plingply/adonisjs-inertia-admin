import axios from 'axios'
export async function getUserPage(params: any) {
  return axios.get('/api/user/list', {
    params,
  })
}

export async function delUserById(id: number) {
  return axios.post('/api/user/delete', { id })
}
export async function createUser(data: any) {
  return axios.post('/api/user/create', data)
}
export async function updateUser(data: any) {
  return axios.post('/api/user/update', data)
}
