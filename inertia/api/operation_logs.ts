import axios from 'axios'
export async function getOperationLogsPage(params: any) {
  return axios.get('/api/operation_logs/list', {
    params,
  })
}
