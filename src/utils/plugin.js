/**
 *
 *  此模块专门处理小函数 和 常用的过滤器
 *
 * */
export default {
  install (Vue) {
    // 该方法会在Vue。use时调用
    Vue.prototype.$hnotify = (params) => Vue.prototype.$notify({ duration: 800, ...params })
    // 给Vue的原型属性赋值一个函数 自定义一个函数名
    // 定义一个原型属性 $sleep 所有组件都有了这个属性
    Vue.prototype.$sleep = sleep
  }
}

// 休眠函数
function sleep (time = 500) {
// 返回一个promise
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      // 肯定是成功执行 但是有一个延迟
      resolve()
    }, time)
  })
}
