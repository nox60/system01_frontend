import request from '@/utils/request'

export function listDeviceData(query) {
  return request({
    url: '/listDeviceData',
    method: 'post',
    data: query
  })
}

export function addOrUpdateDevice(data) {
  return request({
    url: '/addOrUpdateDevice',
    method: 'post',
    data: data
  })
}

export function deleteDevice(id) {
  return request({
    url: `/deleteDevice/${id}`,
    method: 'delete'
  })
}
