import request from '@/utils/request'

export function listConstructData(query) {
  return request({
    url: '/listConstructData',
    method: 'post',
    data: query
  })
}

export function addOrUpdateConstruct(data) {
  return request({
    url: '/addOrUpdateConstruct',
    method: 'post',
    data: data
  })
}

export function deleteConstruct(id) {
  return request({
    url: `/deleteConstruct/${id}`,
    method: 'delete'
  })
}
