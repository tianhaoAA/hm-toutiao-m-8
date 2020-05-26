<template>
<div class="container">
     <van-nav-bar title="登录" left-arrow  @click-left="$router.go(-1)"></van-nav-bar>
  <!-- 登录布局 -->
  <van-cell-group>
    <van-field @blur="checkMobie" :error-message="errorMessage.mobile"  v-model.trim="loginForm.mobile" label="手机号" placeholder="请输入手机号"></van-field>
    <van-field @blur="checkCode"  :error-message="errorMessage.code" v-model.trim="loginForm.code" label="验证码" placeholder="请输入验证码">
      <van-button  style="button" size="small" type="primary"></van-button>
    </van-field>
  </van-cell-group>
<div class="login-box">
    <van-button @click="login" type="info" round block  size="small">登录</van-button>
</div>
  </div>
</template>

<script>
import { login } from '@/api/user'
import { mapMutations } from 'vuex'
export default {
  data () {
    return {
      //  表单数据
      loginForm: {
        // 手机号
        mobile: '13999999999',
        // 验证码
        code: '246810'
      },
      // 两个消息提示的变量
      errorMessage: {
        // 手机号的错误消息
        mobile: '',
        // 验证码的错误对象
        code: ''
      }
    }
  },
  methods: {
    // 把vuex中的方法调用
    ...mapMutations(['updateUser']),
    // 手机号的验证方法
    checkMobie () {
      if (!this.loginForm.mobile) {
        // 表示为空
        this.errorMessage.mobile = '手机号不能为空'
        return false
      }
      if (!/^1[3-9]\d{9}$/.test(this.loginForm.mobile)) {
        this.errorMessage.mobile = '手机号格式不正确'
        return false
      }
      this.errorMessage.mobile = ''
      return true
    },
    // 验证码的验证方法
    checkCode () {
      if (!this.loginForm.code) {
        this.errorMessage.code = '验证码不能为空'
        return false
      }
      if (!/^\d{6}$/.test(this.loginForm.code)) {
        this.errorMessage.code = '验证码必须为6位数字'
        return false
      }
      this.errorMessage.code = ''
      return true
    },
    async login () {
    //  登录校验
    // 这两个方法都通过的话
      try {
        if (this.checkMobie() && this.checkCode()) {
        // console.log(11)
          const res = await login(this.loginForm)
          console.log(res)
          // 拿到token 之后 应该把 token设置vuex 中的state中
          // 相当于更新当前的token 和 refresh_token
          this.updateUser({
            user: res
          })
          // 1 判断是否有需要跳转的页面 如果有 就跳转 如果没有 不用管 直接跳到主页
          const { redrectUrl } = this.$route.query
          this.$router.push(redrectUrl || '/')
        }
      } catch (error) {
        this.$notify({ message: '用户名或者验证码错误', duration: 800 })
      }
    }
  }
}
</script>

<style>
 .login-box {
   margin: 20px;
 }
</style>
