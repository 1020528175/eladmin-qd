import request from '@/utils/request'

import Vue from 'vue'
export const Bus = new Vue()

export function get() {
  return request({
    url: 'api/email',
    method: 'get'
  })
}

export function update(data) {
  return request({
    url: 'api/email',
    data,
    method: 'put'
  })
}

export function send(data) {
  return request({
    url: 'api/email',
    data,
    method: 'post'
  })
}
