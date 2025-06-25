import axios from 'axios'
export async function login(username: string, password: string) {
  return axios.post('/api/login', { username, password })
}
