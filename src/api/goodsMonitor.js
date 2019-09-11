import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/goodsMonitor',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/goodsMonitor/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/goodsMonitor',
    method: 'put',
    data
  })
}

//通过商品链接去获取商品的信息
export function getGoodsInfo(params) {
  return request({
    url: 'api/getGoodsInfo',
    method: 'get',
    params
  })
}
