import axios from 'axios'
export async function getRolePage(params: any) {
  return axios.get('/api/role/list', {
    params,
  })
}

export async function delRoleById(id: number) {
  return axios.post('/api/role/delete', { id })
}
export async function updateRole(data: any) {
  return axios.post('/api/role/update', data)
}
