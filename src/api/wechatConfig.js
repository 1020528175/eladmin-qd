import request from '@/utils/request'

export function get() {
  return request({
    url: 'api/wechatConfig',
    method: 'get'
  })
}

export function update(data) {
  return request({
    url: 'api/wechatConfig',
    data,
    method: 'put'
  })
}
