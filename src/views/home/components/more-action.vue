
<template>
  <div class="more-action">
    <van-cell-group v-if="!isReport">
      <van-cell @click="$emit('deslike')">不感兴趣</van-cell>
      <van-cell is-link @click="isReport=true">反馈垃圾内容</van-cell>
      <van-cell>拉黑作者</van-cell>
    </van-cell-group>
    <van-cell-group v-else>
      <van-cell icon="arrow-left" @click="isReport=false">返回</van-cell>
      <!-- 注册举报项的点击事件 -->
      <van-cell @click="$emit('report',item.value)" v-for="item in reports" :key="item.value">{{item.label}}</van-cell>

    </van-cell-group>
  </div>

</template>

<script>
import { reports } from '@/api/constants'
import eventBus from '@/utils/eventbus'
export default {
  data () {
    return {
      isReport: false,
      reports
    }
  },
  created () {
    eventBus.$on('delArticle', () => {
      this.isReport = false
    })
  }

}

</script>

<style lang='less' scoped>
.more-action {
  border-radius: 4px;
}
</style>
