<template>
  <div class="container">
    <!-- 搜索组件一级路由   返回上一个页面-->
    <van-nav-bar left-arrow title="搜索中心" @click-left="$router.back()"></van-nav-bar>
    <!-- 导航 -->
    <van-search v-model.trim="q"  placeholder="请输入搜索关键词" shape="round" />
    <van-cell-group class="suggest-box" v-if="q" >
      <van-cell icon="search">
        <span>j</span>ava
      </van-cell>
    </van-cell-group>
    <div class="history-box" v-if="!q">
      <div class="head"  v-if="historyList.length>0">
        <span>历史记录</span>
        <van-icon name="delete"></van-icon>
      </div>
      <van-cell-group>
        <!-- 如果没有历史记录 就不去显示 -->
        <van-cell v-for="(item,index) in historyList" :key="index">
          <a class="word_btn">{{item}}</a>
          <van-icon class="close_btn" @click="delHistory(index)" slot="right-icon" name="cross" />
        </van-cell>
      </van-cell-group>
    </div>
  </div>
</template>

<script>
const key = 'heima-8-history'
export default {
  name: 'search',
  data () {
    return {
      // 关键词的数据
      q: '',
      // 接收历史搜索记录
      historyList: []
    }
  },
  created () {
    this.historyList = JSON.parse(localStorage.getItem(key) || '[]')
  },
  methods: {
    // 点击删除 删除历史记录
    delHistory (index) {
      // 删除对应的历史记录
      this.historyList.splice(index, 1)
      JSON.parse(localStorage.setItem(key, JSON.stringify(this.historyList)))
    }
  }
}
</script>

<style lang='less' scoped>
.history-box {
  padding: 0 20px;
  .head{
    line-height: 36px;
    color: #999;
    .van-icon{
      font-size: 16px;
      float: right;
      margin-top: 10px;;
    }
  }
  .van-cell{
    padding: 10px 0;
  }
  .word_btn{
    color:#3296fa;
  }
  .close_btn{
    margin-top:5px;
    color: #999;
  }
}
.suggest-box{
  /deep/ .van-cell{
    padding: 10px 20px;
    color: #999;
    p{
      span{
        color: red;
      }
    }
  }
}
</style>
