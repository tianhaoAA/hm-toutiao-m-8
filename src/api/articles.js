/*****
 *
 * 处理文章模块的数据
 *
 ***/
/**
 *
 * @param 需要传递 时间戳 timestamp
 *       channel_id (频道的id)
 * ***/
import request from '@/utils/request'
export function getArticles (params) {
  return request({
    url: 'http://ttapi.research.itcast.cn/app/v1_1/articles',
    params: { with_top: 1, ...params }
  })
}

/*****
 *
 * 不喜欢文章的id
 *
 * ***/
export function dislikeArticle (data) {
  return request({
    url: '/article/dislikes',
    method: 'post',
    // body 参数应该位于 data
    data
  })
}

/****
 *
 *
 * 举报文章的接口
 *

 *****/
export function reportArticle (data) {
  return request({
    url: '/article/reports',
    method: 'post',
    data
  })
}
