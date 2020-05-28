<template>
  <div class="container">
    <!-- 导航 显示返回箭头-->
    <!-- click-left点击左侧事件 -->
    <!-- $router.go(-1) $router.back() -->
    <!-- 将 导航栏固定在顶部 -->
    <van-nav-bar fixed title="搜索结果" left-arrow @click-left="$router.back()"></van-nav-bar>
    <!-- 防止搜索结果列表 -->
    <van-list v-model="upLoading" :finished="finished" @load='onLoad'>
      <van-cell-group>
        <van-cell v-for="item in articles" :key="item.art_id.toString()">
          <div class="article_item">
            <h3 class="van-ellipsis">{{ item.title}}</h3>
            <div class="img_box">
              <van-image class="w33" fit="cover" :src="item.cover.images[0]" />
              <van-image class="w33" fit="cover" :src="item.cover.images[1]" />
              <van-image class="w33" fit="cover" :src="item.cover.images[2]" />
            </div>
            <div class="img_box">
              <van-image class="w100" fit="cover" :src="item.cover.images[0]" />
            </div>
            <div class="info_box">
              <span>{{ item.aut_name}}</span>
              <span>{ item.comm_count} 评论</span>
              <span>{{ item.pubdate |relTime}}</span>
            </div>
          </div>
        </van-cell>
      </van-cell-group>
    </van-list>
  </div>
</template>

<script>
import { searchArticle } from '@/api/articles'
export default {
  data () {
    return {
      // 上啦加载状态
      upLoading: false,
      // 表示当前的加载是否全部完成 了 如果全部完成了 应该讲finished 设置为true
      finished: false,
      // 放置搜索结果文章的
      articles: [],
      page: {
        // 当前第几页
        page: 1,
        // 每页多少条
        per_page: 10
      }
    }
  },
  methods: {
    async onLoad () {
    // 加载数据
      const { q } = this.$route.query
      const res = await searchArticle({ ...this.page, q })
      // 得到结果 应该加到article 中
      this.articles.push(...res.results)
      // 关闭上拉加载的状态
      this.upLoading = false
      // 如果 返回的数据 是0 的话 就没有下一页数据
      if (res.results.length) {
        this.page.page++
      } else {
        this.finished = true
      }
    }
  }
}
</script>

<style lang='less' scoped>
.container {
  padding-top: 46px;
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}
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
      height: 180px;
      width: 100%;
    }
  }
  .info_box {
    color: #999;
    line-height: 2;
    position: relative;
    span {
      padding-right: 10px;
    }
  }
}
</style>
