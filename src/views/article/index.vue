<template>
 <div class='container'>
    <van-nav-bar fixed title="文章详情" left-arrow @click-left="$router.back()" />
    <div class="detail">
      <h3 class="title">{{ article.title}}</h3>
      <div class="author">
        <van-image round width="1rem" height="1rem" fit="fill" :src="article.aut_photo" />
        <div class="text">
          <p class="name">{{ article.aut_name}}</p>
          <p class="time">{{ article.pubdate|relTime}}</p>
        </div>
        <van-button :loading="followLoading" @click="follow" round size="small" type="info"> {{ article.is_followed ? '已关注': '+ 关注'}}</van-button>
      </div>
      <div class="content" v-html="article.content">

      </div>
      <div class="zan">
        <van-button round size="small" :class="{active :article.attitude===1}" plain icon="like-o">点赞</van-button>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <van-button round  :class="{active :article.attitude===0}" size="small" plain icon="delete">不喜欢</van-button>
      </div>
      <Comment></Comment>
    </div>
    <!-- 遮罩层 -->
    <van-overlay :show="loading">
  <dir class="loading-container">
        <van-loading ></van-loading>
  </dir>
    </van-overlay>
  </div>
</template>

<script>
import { getArticleInfo } from '@/api/articles'
import { followUser, unfollowUser } from '@/api/user'
import Comment from './components/comment'
export default {
  components: {
    Comment
  },
  data () {
    return {
      article: {},
      // 是否正在点击关注
      followLoading: false,
      // 当前文章的加载状态
      loading: true
    }
  },
  methods: {
    async  getArticleInfo () {
      this.loading = true
      // 获取文章的id
      const { artId } = this.$route.query
      const res = await getArticleInfo(artId)
      this.loading = false
      this.article = res
      console.log(res)
    },
    async  follow () {
      // 调用 关注或者取消关注
      //  状态是相反的
      this.followLoading = true
      try {
        if (this.article.is_followed) {
          await unfollowUser(this.article.aut_id)
          this.$hnotify({ type: 'success', message: '取消关注成功' })
        } else {
          await followUser({ target: this.article.aut_id })
          this.$hnotify({ type: 'success', message: '关注成功' })
        }
        // 不会重新加载 只会修改对应的数据状态
        this.article.is_followed = !this.article.is_followed
      } catch (error) {
        this.$hnotify({ message: '操作失败' })
      } finally {
        this.followLoading = false
      }
    }
  },
  created () {
    this.getArticleInfo()
  }
}
</script>

<style lang='less' scoped>
.loading-container  {
       width: 100%;
       height: 100%;
       display: flex;
       justify-content: center;
     align-items: center;
}
.van-overlay {
  background: none;
}
.container {
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}
.detail {
  padding: 46px 10px 44px;
  .title {
    font-size: 18px;
    line-height: 2;
  }
  .zan{
    text-align: center;
    padding: 10px 0;
    .active{
      border-color:red;
      color: red;
    }
  }
  .author {
    padding: 10px 0;
    display: flex;
    position:sticky;
    background-color: #fff;
    top:46px;
    z-index: 2;
    .text {
      flex: 1;
      padding-left: 10px;
      line-height: 1.5;
      .name {
        font-size: 14px;
        margin: 0;
      }
      .time {
        margin: 0;
        font-size: 12px;
        color: #999;
      }
    }
  }
  .content {
    padding: 20px 0;
    overflow: hidden;
    white-space: pre-wrap;
    word-break: break-all;
    /deep/ img{
      max-width:100%;
      background: #f9f9f9;
    }
    /deep/ code{
      white-space: pre-wrap;
    }
  }
}
</style>
