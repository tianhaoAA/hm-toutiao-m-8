
/****
 *
 *  requset.js 请求管理工具
 *
 * ***/

import aixos from 'axios'
import JSONBigint from 'json-bigint'
// 引入 vuex 中的store 实例对象的
import store from '@/store'

// axios.defaulet 是对原有默认值 进行修改
// axios.create() //相当于 new 了一个新的axios 实例
const instance = aixos.create({
  // 基础的请求地址
  baseURL: 'http://ttapi.research.itcast.cn/app/v1_0',
  // 此函数是后台相应回来 但是还没有进到axios 的响应拦截器时执行 数组中可以写多个实例
  transformRequest: [function (data) {
    //  data 就是后端相应回来的字符串
    return data ? JSONBigint.parse(data) : {}
  }]

})
// token 的注入 应该在请求之前 也就是在请求拦截器
instance.interceptors.request.use(function (config) {
  // 成功的时候执行  读取配置信息 注入token
  if (store.state.user.token) {
    config.headers.Authorization = `Bearer ${store.state.user.token}`
  }
  return config
}, function (err) {
  // 失败的时候执行
  return Promise.reject(err)
})

// 在 响应拦截器处理返回数据
instance.interceptors.response.use(function (response) {
  // 几乎所有的返回数据 都有一层数据
  try {
    //   如果两层可以解开 则执行
    return response.data.data
  } catch (error) {
    return response.data
  }
}, function (err) {
  // 失败的时候执行此函数
  return Promise.reject(err)
})
// 创建一个axios的新实例
export default instance
