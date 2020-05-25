<template>
<div class="container">
     <van-nav-bar title="登录" left-arrow  @click-left="$router.go(-1)"></van-nav-bar>
  <!-- 登录布局 -->
  <van-cell-group>
    <van-field label="手机号" placeholder="请输入手机号"></van-field>
    <van-field label="验证码" placeholder="请输入验证码">
      <van-button style="button" size="small" type="primary"></van-button>
    </van-field>
  </van-cell-group>
<div class="login-box">
    <van-button type="info" round block  size="small">登录</van-button>
</div>
  </div>
</template>

<script>
export default {

}
</script>

<style>
 .login-box {
   margin: 20px;
 }
</style>
