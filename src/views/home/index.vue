<template>
  <div class="container">
    <!-- 放置tabs组件 -->
<van-tabs v-model="activeIndex">
  <!-- 内部需要放置 标签 title是当期显示的内容 -->
 <van-tab  v-for="item in channels" :key="item.id" :title="item.name">
<div class="scroll-wrapper">
   <!-- <van-cell-group>
   <van-cell title="标题" value="内容" v-for="item in 20" :key="item"></van-cell>
 </van-cell-group> -->
 <ArticleList  @showAction='showAction' :channel_id='item.id'></ArticleList>
</div>
</van-tab>
</van-tabs>
<!-- 在tabs下放置图标 编辑频道的图标  -->
<span class="bar_btn">
  <van-icon name="wap-nav"></van-icon>
</span>
<!-- 放置一个弹层组件 -->
<van-popup v-model="show" style="width:80%">
  <MoreAction @deslike='deslike'></MoreAction>
</van-popup>
  </div>
</template>

<script>
// @ is an alias to /src
import ArticleList from './components/article-list'
import MoreAction from './components/more-action'
import { getMyChannels } from '@/api/channels'
import { dislikeArticle } from '@/api/articles'
import eventBus from '@/utils/eventbus'
export default {
  name: 'Home',
  data () {
    return {
      //   专门接受频道数据
      channels: [],
      // 是否显示弹层
      show: false,
      articleId: null,
      // 当前默认激活的页签
      activeIndex: 0
    }
  },
  components: {
    ArticleList, MoreAction

  },
  methods: {
    // 点击不感兴趣的时候触发的方法
    async   deslike () {
      try {
        await dislikeArticle({
          target: this.articleId
        })
        // 可以传递  文章id 还有 频道id  删除对应的频道id
        eventBus.$emit('delArticle', this.articleId, this.channels[this.activeIndex].id)
        this.show = false
        this.$hnotify({ type: 'success', message: '操作成功' })
      } catch (error) {
        // 默认是红色的
        this.$hnotify({ message: '操作失败' })
      }
    },
    async   getMyChannels () {
      const res = await getMyChannels()
      this.channels = res.channels
    },
    showAction (id) {
      this.show = true
      // 把文章id 存储起来
      this.articleId = id
    }
  },
  created () {
    this.getMyChannels()
  }
}
</script>
<style lang="less" scoped>
.van-tabs {
  height: 100%;
  display: flex;
  flex-direction: column;
  /deep/ .van-tabs__wrap {
    height: 36px;
    padding-right: 36px;
    .van-tab {
      line-height: 36px;
    }
    .van-tabs__line {
      background-color: #3296fa;
      height: 2px;
    }
  }
  /deep/ .van-tabs__content{
    flex: 1;
    overflow: hidden;
  }
  /deep/ .van-tab__pane{
    height: 100%;
    .scroll-wrapper{
      height: 100%;
      overflow-y: auto;
    }
  }
}
.bar_btn {
  width: 36px;
  height: 35px;
  position: absolute;
  top: 0;
  right: 0;
  &::before {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 999;
    box-shadow: 0 0 10px #999;
    transform: scale(1, 0.6);
  }
  .van-icon-wap-nav {
    width: 100%;
    height: 100%;
    background: #fff;
    text-align: center;
    line-height: 35px;
    position: relative;
    z-index: 1000;
    &::before {
      font-size: 20px;
    }
  }
}
</style>
