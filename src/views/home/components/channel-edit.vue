<template>
  <div class="channel-edit">
    <div class="channel">
      <div class="tit">
        我的频道：
        <span class="tip">点击可进入频道</span>
        <van-button v-if="!editing" @click="editing=true" size="mini" type="info" plain>编辑</van-button>
        <van-button v-else @click="editing=false" size="mini" type="danger" plain>完成</van-button>
      </div>
      <van-grid class="van-hairline--left">
        <van-grid-item v-for="(item,index) in channels" :key="item.id">
          <!-- 点击频道项的时候 需要把当前的频道id传出去 也可以传索引 -->
          <!-- <span  @click="$emit('selectChannel',item.id)"  class="f12">{{ item.name }}</span> -->
          <span  @click="$emit('selectChannel',index)" :class="{ red :index===activeIndex}" class="f12">{{ item.name }}</span>
          <!-- 叉号标签 应该 在进入编辑状态时显示 应该在编辑状态时不显示 -->
          <van-icon @click="$emit('delChannels',item.id)" v-if="index!=0&&editing" class="btn" name="cross"></van-icon>
        </van-grid-item>
      </van-grid>
    </div>
    <div class="channel">
      <div class="tit">可选频道：</div>
      <van-grid class="van-hairline--left">
        <van-grid-item v-for="item in  optionalChannels" :key="item.id">
          <span class="f12">{{item.name}}</span>
          <!-- 注册点击事件 -->
          <van-icon class="btn" @click="$emit('addChannels',item)" name="plus"></van-icon>
        </van-grid-item>
      </van-grid>
    </div>
  </div>
</template>

<script>
import { getAllChannels } from '@/api/channels'
export default {
  data () {
    return {
      editing: false,
      // 接收全部的频道数据
      AllChannels: []
    }
  },
  props: {
    channels: {
      require: true,
      type: Array,
      default: () => []
    },
    activeIndex: {
      require: true,
      type: Number,
      default: 0
    }
  },
  methods: {
    async getAllChannels () {
      const res = await getAllChannels()
      this.AllChannels = res.channels
      console.log(res)
    }
  },

  created () {
    this.getAllChannels()
  },
  //    可选频道 是一个动态的结果
  computed: {
    optionalChannels () {
      return this.AllChannels.filter(item => !this.channels.some(o => o.id === item.id))
    }
  }
}
</script>

<style lang='less' scoped>
.channel-edit {
  .channel {
    padding: 10px;
    .tit {
      line-height: 3;
      .tip {
        font-size: 10px;
        color: #999;
      }
    }
    .van-button {
      float: right;
      margin-top: 7px;
    }
    .btn {
      position: absolute;
      bottom: 0;
      right: 0;
      background: #ddd;
      font-size: 12px;
      color: #fff;
    }
    .f12 {
      font-size: 12px;
      color: #555;
    }
    .red {
      color: red;
    }
  }
}
</style>
