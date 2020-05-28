/****
 *  专门处理频道的请求
 * **/
import request from '@/utils/request'
import store from '@/store'
// 游客的 key
const CACHE_CHANNEL_V = 'heima-8-v'
// 登录的 key
const CACHE_CHANNEL_T = 'heima-8-t'
export function getMyChannels () {
  // 我们要对原来的方法 进行改造 但是不想
  return new Promise(function (resolve, reject) {
    // 支持本地化的缓存  要区分当前是登录用户 还是游客用户
    // 可以根据 当前有没有token区分有没有登录
    const key = store.state.user.token ? CACHE_CHANNEL_V : CACHE_CHANNEL_T
    // 去缓存中读取 用户频道数据
    const str = localStorage.getItem(key)
    if (str) {
    //  本地缓存有数据
      resolve({ channels: JSON.parse(str) })
    } else {
      // 本地缓存没有数据 要去线上拉取数据 得到线上的用户信息

      request({
        url: '/user/channels'
      }).then(res => {
      //  获取请求的结果
        localStorage.setItem(key, JSON.stringify(res.channels))
        // 这里表示 直接 成功执行 获取用户的数据
        resolve(res)
      })
    }
  })
  // return request({
  //   url: '/user/channels'
  // })
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

/*****
 *
 *    删除频道
 * @param id 删除
 * ***/
export function delChannels (id) {
  return new Promise(function (resolve, reject) {
    // 有id 就可以从缓存中删除数据
    const key = store.state.user.token ? CACHE_CHANNEL_V : CACHE_CHANNEL_T
    const channels = JSON.parse(localStorage.getItem(key))
    // channels = channels.filter(item => item.id !== id)
    // localStorage.setItem(key, JSON.stringify(channels))
    const index = channels.findIndex(item => item.id === id)
    if (index > -1) {
      channels.splice(index, 1)
      localStorage.setItem(key, JSON.stringify(channels))
      resolve()
    } else {
      reject(new Error('没有找到对应的频道'))
    }
  })
}
