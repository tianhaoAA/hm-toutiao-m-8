
/****
 *
 *  requset.js 请求管理工具
 *
 * ***/

import aixos from 'axios'
import JSONBigint from 'json-bigint'
// 引入 vuex 中的store 实例对象的
import store from '@/store'
import router from '@/router'

// axios.defaulet 是对原有默认值 进行修改
// axios.create() //相当于 new 了一个新的axios 实例
const instance = aixos.create({
  // 基础的请求地址
  baseURL: 'http://ttapi.research.itcast.cn/app/v1_0',
  // 此函数是后台相应回来 但是还没有进到axios 的响应拦截器时执行 数组中可以写多个实例
  transformResponse: [function (data) {
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
}, async function (error) {
  // 如果请求失败或者失效或者其他错误 会进入到相应拦截器的错误的区域
  // 只要是 401 就是token 失效 （应该用导航守卫将没有token的拦截器在外面）
  /*
     config 是出现这次错误的配置信息
     request 请求对象
     respose 响应对象 satus(状态码)
    **/
  if (error.response && error.response.status === 401) {
    const path = {
      path: '/login',
      query: {
        //   需要传递的query参数 返回登录页 并把当前的地址传递出去
        redrectUrl: router.currentRouter.fullPath
      }
    }
    if (store.state.user.refrsh_token) {
      try {
        //    表示本地有能换取的钥匙
      // 如果有refrsh_token我们要换取token
      // 需要调用刷新用户的token接口

        const res = await aixos({
          url: 'http://ttapi.research.itcast.cn/app/v1_0/authorizations', // 完整的url地址
          headers: { Authorization: `Bearer ${store.state.user.refresh_token}` },
          method: 'put'
        })
        // 拿到token

        store.commit('updateUser',
          {
            user: {
              token: res.data.data.token,
              refresh_token: store.state.user.refresh_token
            }
          }
        )
        // 需要把之前的错误请求再次发出去
        return instance(error.config)
      } catch (error) {
      //  如果失败 意味着 refresh_token 到期了
        // 需要重新登录 之前的 需要删除本地的token 在去登录页面
        store.commit('delUser')
        router.push(path)
      }
    } else {
    //   没有的话 直接跳到登录页
      // router.push('/login')
      // 当用户在 a页面 token失效的时候 跳转到登录页 登录成功应该返回a页面
      //  获取当前带参数的地址  router.currentRouter.fullPath
      store.commit('delUser')
      router.push(path)
    }
  }
  // 失败的时候执行此函数
  return Promise.reject(error)
})
// 创建一个axios的新实例
export default instance
