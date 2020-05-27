<template>
  <!-- 文章列表组件 放置列表 -->
  <!-- van-list 可以帮助我们 实现上拉加载 需要一些变量 -->
  <!-- 需要做阅读记忆 -->
  <div class="scroll-wrapper">
    <van-list v-model="upLoading"   finished-text='没有更多数据了' :finished="finished" @load="onLiad">
        <!-- 循环内容 -->
        <van-cell-group>
  <van-cell title="标题" :value="`内容${index}`" v-for="(item,index) in artcles" :key="item"></van-cell>
        </van-cell-group>

    </van-list>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 表示是否开启上拉加载 默认为false
      upLoading: false,
      //   表示数据是否完成所有的加载 默认为false
      finished: false,
      artcles: []
    }
  },
  methods: {
    onLiad () {
      console.log('开始加载')
      //   setTimeout(() => {
      //     this.finished = true
      //   }, 1000)
      if (this.artcles.length > 50) {
        this.finished = true
      } else {
        const arr = Array.from(Array(10), (value, index) => index + 1)
        this.artcles.push(...arr)
        this.upLoading = false
      }
    }
  }
}
</script>

<style>
</style>
