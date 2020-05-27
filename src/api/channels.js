/****
 *  专门处理频道的请求
 * **/
import request from '@/utils/request'

export function getMyChannels () {
  return request({
    url: '/user/channels'
  })
}

/***
 *
 * 获取全部频道的方法
 * ***/
export function getAllChannels () {
  return request({
    url: '/channels'
  })
}
