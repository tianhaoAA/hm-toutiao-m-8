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

/****
 *
 * 获取联想搜索建议
 *
 * **/
export function getSuggestion (params) {
  return request({
    url: '/suggestion', // 搜搜建议地址
    params
  })
}

/***
 * 搜索文章的方法
 *
 * **/
export function searchArticle (params) {
  return request({
    url: '/search',
    // 关键词 及分页信息
    params
  })
}

/****
 *
    获取文章的详情*

 ***/
export function getArticleInfo (artId) {
  return request({
    url: `/articles/${artId}`
  })
}

/***
 *
 *  获取评论 或者评论回复
 *
 * ***/
export function getComments (params) {
  return request({
    url: '/comments',
    params
    // type (是文章的回复， 还是回复的回复)
    // source(来源于id)
    // offset(偏移量 分页的依据) 查第二页的数据 传入第一页的最后一个id
  })
}

/**
 *
 *   评论的评论
 * **/
export function commentsOrReply (data) {
  return request({
    url: '/comments',
    method: 'post',
    data
  })
}
