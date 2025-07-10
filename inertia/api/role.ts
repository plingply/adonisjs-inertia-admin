import axios from 'axios'
export async function getRolePage(params: any) {
  return axios.get('/api/role/list', {
    params,
  })
}
