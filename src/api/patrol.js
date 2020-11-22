import request from '@/utils/request'

export function listPatrolData(query) {
  return request({
    url: '/listPatrolData',
    method: 'post',
    data: query
  })
}

export function addOrUpdatePatrol(data) {
  return request({
    url: '/addOrUpdatePatrol',
    method: 'post',
    data: data
  })
}

export function deletePatrol(id) {
  return request({
    url: `/deletePatrol/${id}`,
    method: 'delete'
  })
}
