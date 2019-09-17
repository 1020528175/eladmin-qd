import request from '@/utils/request'

export function get(params) {
  return request({
    url: 'api/wechatConfig',
    method: 'get',
    params
  })
}

export function update(data) {
  return request({
    url: 'api/wechatConfig',
    data,
    method: 'put'
  })
}
