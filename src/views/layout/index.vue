<template>
  <div class="container">
    <!-- vant 组件库    fixed 固定在顶部-->
    <van-nav-bar @click-right="$router.push('/search')" title="黑马头条" right-text="搜索" fixed v-if="this.$route.path!=='/user'"></van-nav-bar>
    <!-- 二级路由容器 -->
    <!-- 判断当前的地址 如果是/user 给一个noTop class -->
    <div class="my-wrapper" :class="{ noTop :$route.path ==='/user' }">
     <!-- 缓存二级理由容器 -->
    <keep-alive>
        <router-view></router-view>
    </keep-alive>
    </div>
    <!-- 加上 route 表示开启路由模式 -->
    <van-tabbar route>
      <van-tabbar-item icon='wap-home-o' to='/'>首页</van-tabbar-item>
      <van-tabbar-item icon='friends' to='/question'>问答</van-tabbar-item>
      <van-tabbar-item icon='video' to='/video'>视频</van-tabbar-item>
      <van-tabbar-item icon='manager' to='/user'>我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {}
</script>

<style lang='less' scoped>
.container {
  width: 100%;
  height: 100%;
  position: relative;
  .my-wrapper {
    width: 100%;
    height: 100%;
    overflow: hidden;
    padding-top: 46px;
    padding-bottom: 50px;
    box-sizing: border-box;
    &.noTop {
      padding-top: 0;
    }
  }
}
</style>
