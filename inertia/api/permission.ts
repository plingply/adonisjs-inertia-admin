import axios from 'axios'
export async function getPermissionPage(params: any) {
  return axios.get('/api/permission/list', {
    params,
  })
}

export async function delPermissionById(id: number) {
  return axios.post('/api/permission/delete', { id })
}
export async function updatePermission(data: any) {
  return axios.post('/api/permission/update', data)
}
