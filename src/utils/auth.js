/***
 *  专门处理 token的读取和删除
 * 2020年 5月24日
 * **/
// 专门存储用户信息
const USER_TOKEN = 'heima-toutiao-8'

// 设置用户的token 信息
export function setUser (user) {
  // user 是一个对象
  // 对象转换成字符串
  window.localStorage.setItem(USER_TOKEN, JSON.stringify(user))
}

// 获取用户的token 信息
export function getUser () {
  // 将字符串转化为成对象返回
  return JSON.parse(window.localStorage.getItem(USER_TOKEN) || '{}')
}
// 删除用户的token 信息
export function delUser () {
  // 删除token 的信息
  localStorage.removeItem(USER_TOKEN)
}
