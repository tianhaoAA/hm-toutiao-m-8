/**
 *
 *  此模块专门处理小函数 和 常用的过滤器
 *
 * */
export default {
  install (Vue) {
    // 该方法会在Vue。use时调用
    Vue.prototype.$hnotify = (params) => Vue.prototype.$notify({ duration: 800, ...params })
  }
}
