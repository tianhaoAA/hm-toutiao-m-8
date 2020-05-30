<template>
  <div class="comment">
    <van-list @load='onLoad' v-model="loading" :finished="finished" finished-text="没有更多了">
      <div class="item van-hairline--bottom van-hairline--top" v-for="item in comments" :key="item.com_id.toString()">
        <van-image
          round
          width="1rem"
          height="1rem"
          fit="fill"
          :src="item.aut_photo"
        />
        <div class="info">
          <p>
            <span class="name">{{ item.ant_name}}</span>
            <span style="float:right">
              <span class="van-icon van-icon-good-job-o zan"></span>
              <span class="count">{{ item.like_count}}</span>
            </span>
          </p>
          <p> {{ item.content}}</p>
          <p>
            <span class="time">{{ item.pubdate| relTime}}</span>&nbsp;
            <van-tag plain @click="openReply(item.com_id.toString())">{{item.reply_count}} 回复</van-tag>
          </p>
        </div>
      </div>
    </van-list>
    <div class="reply-container van-hairline--top">
      <van-field v-model="value" placeholder="写评论...">
        <van-loading v-if="submiting" slot="button" type="spinner" size="16px"></van-loading>
        <span class="submit" v-else slot="button">提交</span>
      </van-field>
    </div>
    <!-- 放置评论的回复面板 -->
       <van-action-sheet v-model="showReply" :round="false" class="reply_dialog" title="回复评论">
         <!-- 关闭 首次加载数据van-list 组 -->
      <van-list :immediate-check="false" v-model="reply.loading" :finished="reply.finished" finished-text="没有更多了">
        <div class="item van-hairline--bottom van-hairline--top" v-for="item in  reply.list" :key="item.com_id.toString()">
          <van-image round width="1rem" height="1rem" fit="fill" :src="item.aut_photo" />
          <div class="info">
            <p><span class="name">{{ item.aut_name}}</span></p>
            <p>{{  item.content}}</p>
            <p><span class="time">{{ item.pubdate| relTime}}</span></p>
          </div>
        </div>
      </van-list>
    </van-action-sheet>
  </div>

  <!-- 都不输入框 -->
</template>

<script>
import { getComments } from '@/api/articles'
export default {
  data () {
    return {
      // 上拉加载中
      loading: false,
      // 全部加载完毕
      finished: false,
      // 输入的内容
      value: '',
      // 控制提交中状态数据
      submiting: false,
      //   评论数据
      comments: [],
      // 偏移量 分页依据
      offset: null,
      showReply: false,
      reply: {
        //   此对象专门放置 面板加载信息
        // 评论的评论加载状态
        loading: false,
        // 评论的加载状态
        finished: false,
        // 作为评论的评论的加载依据
        offset: null,
        // 加载评论的评论的加载数据
        list: [],
        commentID: null // 用来存放评论id 用这个id来去查 这个评论的评论
      }
    }
  },
  methods: {
    openReply (commentId) {
      this.showReply = true
      //   评论的的评论的id
      this.reply.commentId = commentId
      this.reply.list = []
      this.reply.offset = null
      this.reply.finished = false
      this.getReply()
    },
    async   getReply () {
      const res = await getComments({
        type: 'c',
        source: this.reply.commentId,
        offset: this.reply.offset
      })
      //   console.log(res)

      this.reply.list.push(...res.results)
      //   开启加载状态
      this.reply.finished = false
      //   判断这一页的id 是是不是等于 这组评论的id 是不是相等 相等则关闭加载的状态 不等则开启
      this.reply.finished = res.last_id === res.end_id
      //   如果不等的话
      if (!this.reply.finished) {
        //   把本页的最后一个id 作为参数传入
        this.reply.offset = res.last_id
      }
    },
    async onLoad () {
    //   滚动条 距离底部超过一定距离就会触发
      const { artId } = this.$route.query
      const res = await getComments({
      // a 文章评论 c 评论的评论
        type: 'a',
        source: artId,
        offset: this.offset
      })
      this.comments.push(...res.results)
      // 关闭加载的状态
      this.loading = false
      // 需要判断 是否还有下一页
      // if (res.last_id === res.end_id) {
      //   this.finished = true
      // }
      this.finished = res.end_id === res.last_id
      if (!this.finished) {
        this.offset = res.last_id
      }
    }

  }
}
</script>

<style lang='less' scoped>
.reply_dialog {
  height: 100%;
  max-height: 100%;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  .van-action-sheet__header {
    background: #3296fa;
    color: #fff;
    .van-icon-close {
      color: #fff;
    }
  }
  .van-action-sheet__content{
    flex: 1;
    overflow-y: auto;
    padding: 0 10px 44px;
  }
}
.comment {
  margin-top: 10px;
  /deep/ .item {
    display: flex;
    padding: 10px 0;
    .info {
      flex: 1;
      padding-left: 10px;
      .name{
        color:#069;
      }
      .zan{
        vertical-align:middle;
        padding-right:2px;
      }
      .count{
        vertical-align:middle;
        font-size:10px;
        color: #666;
      }
      .time{
        color: #666;
      }
      p {
        padding: 5px 0;
        margin: 0;
      }
    }
  }
  /deep/ .van-button:active::before {
    background: transparent;
  }
}
.reply-container {
  position: fixed;
  left: 0;
  bottom: 0;
  height: 44px;
  width: 100%;
  background: #f5f5f5;
  z-index: 9999;
  .submit {
    font-size: 12px;
    color: #3296fa;
  }
}
</style>
