<template>
  <!-- 文章列表组件 放置列表 -->
  <!-- van-list 可以帮助我们 实现上拉加载 需要一些变量 -->
  <!-- 需要做阅读记忆 -->
  <div class="scroll-wrapper" @scroll="remember" ref="myScroll">
    <van-pull-refresh @refresh="onRefresh" v-model="downLoading" :success-text="successText">
      <van-list v-model="upLoading" finished-text="没有更多数据了" :finished="finished" @load="onLiad">
        <!-- 循环内容 -->
        <van-cell-group>
          <van-cell :to="`/article?artId=${item.art_id.toString()}`" v-for="item in artcles" :key="item.art_id.toString()">
            <!-- 三张图 -->
            <div class="article_item">
              <h3 class="van-ellipsis">{{ item.title}}</h3>
              <div class="img_box" v-if="item.cover.type===3">
                <van-image lazy-load class="w33" fit="cover" :src="item.cover.images[0]" />
                <van-image lazy-load class="w33" fit="cover" :src="item.cover.images[1]" />
                <van-image lazy-load class="w33" fit="cover" :src="item.cover.images[2]" />
              </div>
              <div class="img_box" v-if="item.cover.type===1">
                <van-image lazy-load class="w100" fit="cover" :src="item.cover.images[0]" />
              </div>
              <div class="info_box">
                <span> {{ item.aut_name}} </span>
                <span>{{ item.comm_count }}评论</span>
                <span>{{ item.pubdate |relTime}}</span>
                <!-- 此叉号的显示 应该根据当前登录状态来判断 如果登录了就显示 没有登录就不显示 -->
                <span class="close" v-if="user.token" @click.stop="$emit('showAction',item.art_id.toString())">
                  <van-icon name="cross" ></van-icon>
                </span>
              </div>
            </div>
          </van-cell>
        </van-cell-group>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from '@/api/articles'
import { mapState } from 'vuex'
import eventBus from '@/utils/eventbus'
export default {
  props: {
    //  key( props属性名字) ：value (对象配置)
    channel_id: {
      // 必须传入
      required: true,
      // 必须是数字类型
      type: Number,
      // default 是默认值
      //  默认值的意思 假如你没有传入 prop属性 默认值 就会被采用
      default: null
    }
  },
  data () {
    return {
      // 记录当前滚动的位置
      scrollTop: 0,
      // 表示是否开启上拉加载 默认为false
      upLoading: false,
      //   表示数据是否完成所有的加载 默认为false
      finished: false,
      artcles: [],
      successText: '',
      //   下拉刷新
      downLoading: false,

      // 时间戳
      timestamp: null
    }
  },
  methods: {
    // 记录滚动的事件
    remember (event) {
      // 防抖
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.scrollTop = event.target.scrollTop
      }, 500)
    },
    async onLiad () {
      // console.log('开始加载')
      //   setTimeout(() => {
      //     this.finished = true
      //   }, 1000)
      // if (this.artcles.length > 50) {
      //   this.finished = true
      // } else {
      //   const arr = Array.from(Array(10), (value, index) => index + 1)
      //   this.artcles.push(...arr)
      //   this.upLoading = false
      // }
      await this.$sleep(200)
      const res = await getArticles({
        channel_id: this.channel_id,
        // 如果有历史的时间戳 用历史的 没有的话用当前的
        timestamp: this.timestamp | Date.now()
      })
      // 获取内容 将内容加载到队尾
      this.artcles.push(...res.results)
      // console.log(res.results)

      // 关闭加载的状态
      this.upLoading = false
      // 判断当前有没有历史时间戳
      if (res.pre_timestamp) {
        // 把返回的历史时间戳 给当前的时间戳
        this.timestamp = res.pre_timestamp
      } else {
        this.finished = true
      }
      // console.log(res)
    },
    async   onRefresh () {
      // console.log('下拉刷新')

      // setTimeout(() => {
      //   const arr = Array.from(
      //     Array(2),
      //     (value, index) => '追加' + (index + 1)
      //   )
      //   this.artcles.unshift(...arr)
      //   this.downLoading = false
      //   this.successText = `更新了${arr.length}条数据`
      // }, 1000)
      const res = await getArticles({
        channel_id: this.channel_id,
        // 传递最新的历史时间戳
        timestamp: Date.now()
      })
      // 手动的关闭下拉的状态
      this.downLoading = false
      // 判断返回的数组是否存在
      console.log(res.results.length)

      if (res.results.length) {
        // 把返回的数组替换原来的数组
        this.artcles = res.results
        // 判断返回的数据有没有历史时间戳
        if (res.pre_timestamp) {
        //  存在时候 应该可能上拉加载数据到了队尾 这个时候需要打开列表
          this.finished = false
          // 把返回的历史时间戳 赋值给现在的实际戳
        }
        this.successText = `更新了${res.results.length}条数据`
      } else {
        this.successText = '当前己经是最新的数据了'
      }
    }
  },
  computed: {
    ...mapState(['user'])
  },
  created () {
    // 接收两个参数 一个是文章id 一个是频道的id
    eventBus.$on('delArticle', (artId, channelId) => {
      //  这里我们要判断一下 传递过来的频道id 等于现在的频道id
      if (channelId === this.channel_id) {
        // 删除当前频道id的数据
        const index = this.artcles.findIndex(item => item.art_id.toString() === artId)
        if (index > -1) {
          // 因为下标从0开始
          this.artcles.splice(index, 1)
        }
        // 如果一直删除的话 不能加载数据 从新执行一下下拉刷新
        if (this.artcles.length === 0) {
          // 手动触发onLiad 事件
          this.onLiad()
        }
      }
    })
    eventBus.$on('changTab', (id) => {
      // 此时得不到 this,$ref.myscroll
      if (id === this.channel_id) {
        this.$nextTick(() => {
          // 因为tab 页切换事件 执行之后 article 组渲染 是异步的 没有办法 立刻得出渲染结果
          // vue 是异步渲染 ，如果想得到上一次执行结果 可以在$nexTick中执行
          if (this.scrollTop && this.$refs.myScroll) {
          // 当滚动距离不为0 并且滚动元素 存在的前提下才去滚动
            this.$refs.myScroll.scrollTop = this.scrollTop
          }
        })
      }
    })
  },
  activated () {
    if (this.$refs.myScroll && this.scrollTop) {
      // 判断滚动1位置是否大于0
      // 将div 滚动回原来的位置
      // 把记录的位置滚动原来的位置
      this.$refs.myScroll.scrollTop = this.scrollTop
    }
  }
}
</script>

<style lang='less' scoped>
.article_item {
  h3 {
    font-weight: normal;
    line-height: 2;
  }
  .img_box {
    display: flex;
    justify-content: space-between;
    .w33 {
      width: 33%;
      height: 90px;
    }
    .w100 {
      width: 100%;
      height: 180px;
    }
  }
  .info_box {
    color: #999;
    line-height: 2;
    position: relative;
    font-size: 12px;
    span {
      padding-right: 10px;
      &.close {
        border: 1px solid #ddd;
        border-radius: 2px;
        line-height: 15px;
        height: 12px;
        width: 16px;
        text-align: center;
        padding-right: 0;
        font-size: 8px;
        position: absolute;
        right: 0;
        top: 7px;
      }
    }
  }
}
</style>
