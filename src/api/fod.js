import request from '@/utils/request'

export function listFodData(query) {
  return request({
    url: '/listFodData',
    method: 'post',
    data: query
  })
}

export function addOrUpdateFod(data) {
  return request({
    url: '/addOrUpdateFod',
    method: 'post',
    data: data
  })
}

export function deleteFod(id) {
  return request({
    url: `/deleteFod/${id}`,
    method: 'delete'
  })
}
