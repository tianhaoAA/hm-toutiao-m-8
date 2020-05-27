/**
 *
 *  此模块专门处理小函数 和 常用的过滤器
 *
 * */
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime' // 引入相对时间的插件
import 'dayjs/locale/zh-cn'
dayjs.extend(relativeTime) // 相当于dayjs扩展 相对时间的方法 这个方法写完这后 dayjs就有了form方法
export default {
  install (Vue) {
    // 该方法会在Vue。use时调用
    Vue.prototype.$hnotify = (params) => Vue.prototype.$notify({ duration: 800, ...params })
    // 给Vue的原型属性赋值一个函数 自定义一个函数名
    // 定义一个原型属性 $sleep 所有组件都有了这个属性
    Vue.prototype.$sleep = sleep
    // 过滤器
    Vue.filter('relTime', relTime)
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
/****
 *
 * 此函数用来将 日期转化成 相对时间
 *
 * **/
// 转化时间到相对时间
function relTime (date) {
  // form(中的值是 日期 或者dayjs得到的日期 ) dayjs()当前的日期   dayjs().from(date) 当前时间距离你传入时间有多远
  return dayjs().locale('zh-cn').from(date)
}
