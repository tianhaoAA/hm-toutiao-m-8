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
        <span class="submit" @click="submit" v-else slot="button">提交</span>
      </van-field>
    </div>
    <!-- 放置评论的回复面板 -->
    <!-- 关闭面板 设置为空 -->
       <van-action-sheet  @closed='reply.commentId=null' v-model="showReply" :round="false" class="reply_dialog" title="回复评论">
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
import { getComments, commentsOrReply } from '@/api/articles'
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
    //   提交评论
    async   submit () {
    //   alert(1)
    // 判断用户是否登录了  没有登录的话 去登录页面
      if (this.$store.state.user.token) {
        //    是否输入了评论内容 没有内容 直接返回
        if (!this.value) return false
        // 先把提交状态 打完 提交完之后在关闭 避免重复提交
        this.submiting = true
        await this.$sleep()
        try {
          // 调用接口 发送请求
          const res = await commentsOrReply({
            target: this.reply.commentId ? this.reply.commentId : this.$route.query.artId,
            content: this.value,
            //  如果是对评论进行评论 需要传递该评论属于哪个文章 如果是对文章进行id 则不需要传递
            art_id: this.reply.commentId ? this.$route.query.artId : null
          })
          if (this.reply.commentId) {
            //   存在的话 表示 对评论进行评论
            this.reply.list.unshift(res.new_obj)
            // 需要找到对应的评论 id 回复数加1
            // 如果是对评论进行评论  需要找到 对应的评论id 将评论id的回复数+1
            const comment = this.comments.find(item => item.com_id.toString() === this.reply.commentId)
            comment && comment.reply_count++
          } else {
            //   对文章进行评论
            this.comments.unshift(res.new_obj)
          }
        } catch (error) {
          this.$hnotify({ message: '评论失败' })
        }
        // 关闭状态
        this.submiting = false
        this.value = ''
      } else {
        try {
          await this.$dialog.confirm({
            message: '如果想要去评论,您需要去登录'
          })
          this.$router.push({
            path: '/login',
            query: {
              redrectUrl: this.$route.fullPath
            }
          })
        } catch (error) {

        }
      }
    },
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
