import axios from 'axios'
export async function saveMenu(menus: any[]) {
  return axios.post('/api/menu/save/all', { menus })
}
export async function getAllMenuToTree() {
  return axios.get('/api/menu/tree')
}
export async function delMenuById(id: number) {
  return axios.post('/api/menu/del', { id })
}

export async function createMenu(data: any) {
  return axios.post('/api/menu/create', data)
}
export async function updateMenu(id: number, data: any) {
  return axios.post('/api/menu/update', { ...data, id })
}
