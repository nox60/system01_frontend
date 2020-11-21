import request from '@/utils/request'

export function listTaskData(query) {
  return request({
    url: '/listTaskData',
    method: 'post',
    data: query
  })
}

export function addOrUpdateTask(data) {
  return request({
    url: '/addOrUpdateTask',
    method: 'post',
    data: data
  })
}

export function deleteTask(id) {
  return request({
    url: `/deleteTask/${id}`,
    method: 'delete'
  })
}
