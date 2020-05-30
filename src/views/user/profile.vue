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
          src="https://img.yzcdn.cn/vant/cat.jpeg"
        />
      </van-cell>
      <van-cell is-link title="名称" value="用户名称" />
      <van-cell is-link title="性别" value='男'/>
      <van-cell is-link title="生日" value="2019-08-08" />
    </van-cell-group>
      <!-- 弹层组件 -->
    <van-popup v-model="showPhoto" style="width:80%">
      <!-- 内容 -->
      <!-- 1 本地相册选择图片 -->
      <!-- 2 拍照 -->
       <van-cell is-link title="本地相册选择图片"></van-cell>
       <van-cell is-link title="拍照"></van-cell>
    </van-popup>
    <van-action-sheet :actions="actions" v-model="showGender" cancel-text="取消"></van-action-sheet>

     <!-- 弹昵称 -->
    <van-popup v-model="showName" style="width:80%">
       <!-- 编辑用户昵称  双向绑定用户的昵称-->
       <van-field  type='textarea'  rows="4"></van-field>
    </van-popup>
 <van-popup v-model="showBirthDay" position="bottom">
      <!-- 选择出生日期  出生日期应该小于现在时间-->
      <!-- type表示 当前的日期类型 年月日 -->
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        :min-date="minDate"
        :max-date="maxDate"
         />
    </van-popup>
  </div>

</template>

<script>
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
      currentDate: new Date()
    }
  }
}
</script>

<style>

</style>
