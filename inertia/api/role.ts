import axios from 'axios'
export async function getPage(params: any) {
  return axios.get('/api/role/list', {
    params,
  })
}

export async function delRoleById(id: number) {
  return axios.post('/api/role/delete', { id })
}
export async function create(data: any) {
  return axios.post('/api/role/create', data)
}
export async function update(data: any) {
  return axios.post('/api/role/update', data)
}
