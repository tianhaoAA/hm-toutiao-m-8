<template>
    <div class="container">
    <van-nav-bar left-arrow @click-left="$router.back()" title="编辑资料" right-text="保存" ></van-nav-bar>
    <van-cell-group>
      <van-cell is-link title="头像"  center>
        <van-image
          slot="default"
          width="1.5rem"
          height="1.5rem"
          fit="cover"
          round
          :src="user.photo"
        />
      </van-cell>
      <van-cell is-link title="名称" :value="user.name" @click="showName= true" />
      <van-cell is-link title="性别"  @click="showGender=true" :value="user.gender===0?'男':'女'"/>
      <van-cell is-link title="生日" :value="user.birthday"  @click="showDate"/>
    </van-cell-group>
      <!-- 弹层组件 -->
    <van-popup v-model="showPhoto" style="width:80%">
      <!-- 内容 -->
      <!-- 1 本地相册选择图片 -->
      <!-- 2 拍照 -->
       <van-cell is-link title="本地相册选择图片"></van-cell>
       <van-cell is-link title="拍照"></van-cell>
    </van-popup>
    <!-- 性别 -->
    <van-action-sheet @select="selectItem" :actions="actions" v-model="showGender" cancel-text="取消"></van-action-sheet>
    <!-- 弹昵称 -->
    <van-popup  :close-on-click-overlay="false" v-model="showName" style="width:80%">
       <!-- 编辑用户昵称  双向绑定用户的昵称-->
       <van-field :error-message="nameMsg" v-model.trim="user.name" type='textarea'  rows="4"></van-field>
  <van-button block type="info" @click="btnName" size="normal">确定</van-button>
    </van-popup>
 <van-popup v-model="showBirthDay" position="bottom">
      <!-- 选择出生日期  出生日期应该小于现在时间-->
      <!-- type表示 当前的日期类型 年月日 -->
      <van-datetime-picker
      @cancel='showBirthDay=false'
      @confirm='confirmDate'
         v-model="currentDate"
         type="date"
        :min-date="minDate"
        :max-date="maxDate"
         />
    </van-popup>
  </div>

</template>

<script>
import dayjs from 'dayjs'
import { getUserInfo } from '@/api/user'
export default {
  data () {
    return {
      // 显示头像弹层:
      showPhoto: false,
      // 显示昵称弹层
      showName: false,
      // 显示性别弹层
      showGender: false,
      // 控制生日弹层
      showBirthDay: false,
      actions: [{ name: '男' }, { name: '女' }],
      minDate: new Date(1900, 1, 1),
      maxDate: new Date(),
      currentDate: new Date(),
      user: {
      // 放置个人资料
      // 用户的昵称
        name: '',
        // 性别
        gender: 1,
        // 生日默认值
        birthday: '1990-01-01',
        // 用户的头像
        photo: ''
      },
      //
      nameMsg: ''
    }
  },
  methods: {
    // 修改昵称触发
    btnName () {
      if (this.user.name.length < 1 || this.user.name.length > 7) {
        this.nameMsg = '昵称应该是1-7位的字符'
        return
      }

      this.showName = false
    },
    // 当用户点击性别选项中触发
    selectItem (item, index) {
      this.user.gender = index
      this.showGender = false
    },
    // 显示生日弹层
    showDate () {
      this.showBirthDay = true
      this.currentDate = new Date(this.user.birthday)
    },
    // 确定生日时间
    confirmDate () {
      // this.
      this.user.birthday = dayjs(this.currentDate).format('YYYY-MM-DD')
      this.showBirthDay = false
    },
    async getUserInfo () {
      const res = await getUserInfo(this.user)
      this.user = res
    }
  },
  created () {
    this.getUserInfo()
  }
}
</script>

<style>

</style>
