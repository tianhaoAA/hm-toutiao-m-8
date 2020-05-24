import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/home'

const Layout = () => import('@/views/layout') // 按需引入Layout
const home = () => import('@/views/home') // 按需引入home 二级路由
const question = () => import('@/views/question') // 按需引入 question 二级路由
const video = () => import('@/views/video') // 按需引入video 二级路由
const user = () => import('@/views/user') // 按需引入user  二级路由

// 一级路由
const chat = () => import('@/views/user/chat') // 按需引入user  二级路由
const login = () => import('@/views/login') // 按需引入user  二级路由
const profile = () => import('@/views/user/profile')
const search = () => import('@/views/search')
const result = () => import('@/views/search/result')
const article = () => import('@/views/article')
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Layout,
    children: [{
      // 如果path 什么都不写 默认就是二级路由的默认组件

      path: '',
      component: home
    }, {

      path: '/question',
      component: question
    }, {

      path: '/video',
      component: video
    }, {

      path: '/user',
      component: user
    }]
  }, {

    path: '/user/chat',
    component: chat
  },
  {
    path: '/login',
    component: login
  }, {
    path: '/user/profile',
    component: profile
  }, {
    path: '/user/profile',
    component: profile
  }, {
    path: '/search',
    component: search
  }, {
    path: '/search/result',
    component: result
  }, {
    path: '/article',
    component: article
  }
]

const router = new VueRouter({
  routes
})

export default router
