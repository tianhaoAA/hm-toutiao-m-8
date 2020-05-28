<template>
  <div class="container">
    <!-- 搜索组件一级路由   返回上一个页面-->
    <van-nav-bar left-arrow title="搜索中心" @click-left="$router.back()"></van-nav-bar>
    <!-- 导航 -->
    <van-search @search='onSearch' v-model.trim="q"  placeholder="请输入搜索关键词" shape="round" />
    <van-cell-group class="suggest-box" v-if="q" >
      <van-cell @click="toResilt(item)" v-for="(item,index) in suggestionList" :key="index" icon="search">
        <span> {{ item}} </span>
      </van-cell>
    </van-cell-group>
    <div class="history-box" v-if="!q">
      <div class="head"  v-if="historyList.length>0">
        <span>历史记录</span>
        <van-icon @click="clear" name="delete"></van-icon>
      </div>
      <van-cell-group>
        <!-- 如果没有历史记录 就不去显示 -->
        <van-cell  @click='toSearchlist(item)' v-for="(item,index) in historyList" :key="index">
          <a class="word_btn">{{item}}</a>
          <van-icon class="close_btn" @click.stop="delHistory(index)" slot="right-icon" name="cross" />
        </van-cell>
      </van-cell-group>
    </div>
  </div>
</template>

<script>
import { getSuggestion } from '@/api/articles'
const key = 'heima-8-history'
export default {
  name: 'search',
  data () {
    return {
      // 关键词的数据
      q: '',
      // 接收历史搜索记录
      historyList: [],
      // 联想的搜索数据
      suggestionList: []
    }
  },
  watch: {
    // 函数防抖
    // q () {
    //   clearTimeout(this.timer)
    //   this.timer = setTimeout(async () => {
    //     // 需要判断 当清空的时候 不能发送请求 但是要把联想的建议清空
    //     // 需要去发送请求 联想记忆
    //     if (!this.q) {
    //       this.suggestionList = []
    //       return
    //     }
    //     const res = await getSuggestion({ q: this.q })
    //     this.suggestionList = res.options
    //   }, 300)
    // }
    // 函数节流
    q () {
      this.timer = setTimeout(async () => {
        this.timer = null
        if (!this.q) {
          this.suggestionList = []
          return
        }
        const res = await getSuggestion({ q: this.q })
        this.suggestionList = res.options
      }, 300)
    }

  },
  created () {
    this.historyList = JSON.parse(localStorage.getItem(key) || '[]')
  },
  methods: {
    // 点击联想跳到搜索页
    toResilt (text) {
      this.historyList.push(text)
      this.historyList = Array.from(new Set(this.historyList))
      localStorage.setItem(key, JSON.stringify(this.historyList))
      this.$router.push({
        path: '/search/result',
        query: { q: text }
      })
    },
    onSearch () {
      // 判断是否为空 为空直接跳出
      if (!this.q) return
      this.historyList.push(this.q)
      //  这里要去重 set
      this.historyList = Array.from(new Set(this.historyList))
      localStorage.setItem(key, JSON.stringify(this.historyList))
      this.$router.push({
        path: '/search/result',
        query: { q: this.q }
      })
    },
    toSearchlist (q) {
      this.$router.push({
        path: '/search/result',
        query: { q }
      })
    },
    // 点击删除 删除历史记录
    delHistory (index) {
      // 删除对应的历史记录
      this.historyList.splice(index, 1)
      JSON.parse(localStorage.setItem(key, JSON.stringify(this.historyList)))
    },
    async  clear () {
      // 清空历史记录
      try {
        await this.$dialog.confirm({
          title: '提示',
          message: '您确定要删除所有的历史记录吗'
        })
        this.historyList = []
        localStorage.setItem(key, '[]')
      } catch (error) {

      }
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
