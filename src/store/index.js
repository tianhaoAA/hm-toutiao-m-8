
/***
 *
 * 专门处理vuex中的模块
 *
 *
 * ***/

import Vue from 'vue'
import Vuex from 'vuex'
import * as auth from '@/utils/auth'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 专门放置需要共享的状态
    // user 就是我们token信息对象
    // 设置持久化 不能设置为null
    user: auth.getUser(),
    photo: null
  },
  // 要修改 token 只能通过 mutations
  mutations: {
    updateUser (state, payload) {
      // 定义载荷中的user 数据给state
      state.user = payload.user
      // 更新vue的时候 也应该把最新的数据 存入本地缓存
      auth.setUser(payload.user)
    },
    // 删除token
    delUser (state) {
      state.user = {}
      auth.delUser()
    },
    // 更新头像
    updatePhoto (state, payload) {
      state.photo = payload.photo
    }
  },
  actions: {
  },
  modules: {
  }
})
