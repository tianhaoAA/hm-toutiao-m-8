<template>
  <!-- 文章列表组件 放置列表 -->
  <!-- van-list 可以帮助我们 实现上拉加载 需要一些变量 -->
  <!-- 需要做阅读记忆 -->
  <div class="scroll-wrapper">
    <van-list v-model="upLoading" :finished="finished" @load="onLiad"></van-list>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 表示是否开启上拉加载 默认为false
      upLoading: false,
      //   表示数据是否完成所有的加载 默认为false
      finished: false
    }
  },
  methods: {
    onLiad () {
      console.log('开始加载')
      setTimeout(() => {
        this.finished = true
      }, 1000)
    }
  }
}
</script>

<style>
</style>
