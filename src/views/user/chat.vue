<template>
  <div class="container">
    <van-nav-bar fixed left-arrow @click-left="$router.back()" title="小智同学"></van-nav-bar>
    <div class="chat-list">
      <!-- <div class="chat-item " :class="{left:item.name==='xz',right:item.name!=='xz'}" v-for="(item,index) in list" :key="index">
        <van-image  v-if="item.name==='xz'" fit="cover" round :src="XZImg" />
        <div class="chat-pao">{{ item.msg}}</div>
           <van-image v-if="item.name!=='xz'" fit="cover" round  :src="photo" />
      </div>
      <div class="chat-item right">
        <div class="chat-pao">ewqewq</div>
        <van-image  fit="cover" round :src="photo" />
      </div> -->
          <div class="chat-item" :class="{left: item.name === 'xz', right: item.name!=='xz'}" v-for="(item,index) in list" :key="index">
        <!-- 如果是小智说的 头像应该在左边 -->
        <van-image v-if="item.name==='xz'" fit="cover" round :src="XZImg" />
        <!-- 内容 -->
        <div class="chat-pao">{{ item.msg }}</div>
        <!-- 如果不等于小智 头像右边 -->
        <van-image v-if="item.name!=='xz'"  fit="cover" round :src="photo" />
      </div>

  <!-- <van-nav-bar fixed left-arrow @click-left="$router.back()" title="小智同学"></van-nav-bar>
    <div class="chat-list">
      <div class="chat-item left">
        <van-image fit="cover" round :src="XZImg" />
        <div class="chat-pao">ewqewq</div>
      </div>
      <div class="chat-item right">
        <div class="chat-pao">ewqewq</div>
        <van-image  fit="cover" round  :src="photo" />
      </div>

      </div> -->

    </div>
    <div class="reply-container van-hairline--top">
      <van-field v-model.trim="value" placeholder="说点什么...">
        <van-loading v-if="loading" slot="button" type="spinner" size="16px"></van-loading>
        <span v-else @click="send()" slot="button" style="font-size:12px;color:#999">提交</span>
      </van-field>
    </div>
  </div>
</template>

<script>
import XZImg from '@/assets/1jpg.jpg'
import { mapState } from 'vuex'
import io from 'socket.io-client'
export default {
  data () {
    return {
      // 输入的状态
      loading: false,
      //   输入的内容
      value: '',
      XZImg,
      //   记录聊天记录
      list: []
    }
  },
  computed: {
    ...mapState(['photo', 'user'])
  },
  created () {
    //   建立连接
    this.socket = io('http://ttapi.research.itcast.cn',
      { query: { token: this.user.token } })
    //   这里用的this 可以在这个实例上使用
    // this.socket.on('connect', () => {
    //   //  此时执行 connect事件 表示 已经和服务器打通了电话
    //   // 我们模拟一条数据 让用户看到 服务器和用户说话了
    //   this.list.push({ msg: '秃头小王子,你怎么这么好看', name: 'xz' }) // 加name的原因是想区分 这句话是谁说的
    // })
    this.socket.on('connect', () => {
      this.list.push({ msg: '你好啊', name: 'xz' })
    })
    // 监听回复的消息
    this.socket.on('message', data => {
      this.list.push({ ...data, name: 'xz' })
    })
  },
  methods: {
    // 发送消息
    send () {
    //   console.log(1)

      // 调用websocket 发消息
      //   如果字符串就不能发消息了
      if (!this.value) return false
      //   如果不为空 将状态打开
      this.loading = true
      //   发送消息
      const obj = {
        //  消息内容
        msg: this.value,
        timestamp: Date.now()
      }
      this.socket.emit('message', obj)
      //   发送的消息应该追加消息
      this.list.push(obj)
      this.value = ''
      this.loading = false
    }
  }
}
</script>

<style lang='less' scoped>
.container {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  box-sizing: border-box;
  background:#fafafa;
  padding: 46px 0 50px 0;
  .chat-list {
    height: 100%;
    overflow-y: scroll;
    .chat-item{
      padding: 10px;
      .van-image{
        vertical-align: top;
        width: 40px;
        height: 40px;
      }
      .chat-pao{
        vertical-align: top;
        display: inline-block;
        min-width: 40px;
        max-width: 70%;
        min-height: 40px;
        line-height: 38px;
        border: 0.5px solid #c2d9ea;
        border-radius: 4px;
        position: relative;
        padding: 0 10px;
        background-color: #e0effb;
        word-break: break-all;
        font-size: 14px;
        color: #333;
        &::before{
          content: "";
          width: 10px;
          height: 10px;
          position: absolute;
          top: 12px;
          border-top:0.5px solid #c2d9ea;
          border-right:0.5px solid #c2d9ea;
          background: #e0effb;
        }
      }
    }
  }
}
.chat-item.right{
  text-align: right;
  .chat-pao{
    margin-left: 0;
    margin-right: 15px;
    &::before{
      right: -6px;
      transform: rotate(45deg);
    }
  }
}
.chat-item.left{
  text-align: left;
  .chat-pao{
    margin-left: 15px;
    margin-right: 0;
    &::before{
      left: -5px;
      transform: rotate(-135deg);
    }
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
}
</style>
