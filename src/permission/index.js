/****
 *
 *
 *
 *导航守卫
 *
 *
 * **/
import router from '@/router'
import store from '@/store'

router.beforeEach(function (to, from, next) {
//    判断请求地址的 和你token
  if (to.path.startsWith('/user') && !store.state.user.token) {
    next({
      path: '/login',
      query: {
        //   需要传递的query参数 返回登录页 并把当前的地址传递出去
        redrectUrl: to.fullPath
      }
    })
  } else {
    next()
  }
})
