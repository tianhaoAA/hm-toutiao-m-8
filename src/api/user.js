/***
 *
 * 此文件处理用户相关的强求
 * **/

import request from '@/utils/request'
//  登录的方法

export function login (data) {
  return request({
    //   请求地址
    url: '/authorizations',
    //   方法
    method: 'post',
    // 接收的对象
    data
  })
}

/***
 *
 * 关注用户
 * **/

export function followUser (data) {
  return request({
    url: '/user/followings',
    method: 'post',
    data
  })
}

/*****
 *
 * 取消关注
 *
 * **/

export function unfollowUser (id) {
  return request({
    url: `/user/followings/${id}`,
    method: 'delete'
  })
}
/*
  获取用户的个人信息
**/
export function getUser () {
  return request({
    url: '/user'
  })
}

/***
 * 获取用户的资料
 * **/
export function getUserInfo () {
  return request({
    url: '/user/profile'
  })
}

/**
 *
 *  修改用户的头像
 * **/
export function upadtePhoto (data) {
  return request({
    url: '/user/photo',
    method: 'patch',
    data
  })
}

/***
 *
 * 保存用户的信息
 *
 * ***/
export function saveUserInfo (data) {
  return request({
    url: '/user/profile',
    method: 'patch',
    data: { ...data, photo: null }
  })
}
