import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/stockMonitor',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/stockMonitor/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/stockMonitor',
    method: 'put',
    data
  })
}

/**
 * 通过代码获取股票中文名
 * @param code
 */
export function getStockNameByCode(code) {
  return request({
    url: 'api/stockMonitor/' + code,
    method: 'get'
  })
}
