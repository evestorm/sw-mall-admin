<template>
  <el-row class="user-info" :gutter="10">
    <el-col class="left" :xs="10" :sm="10" :md="10" :lg="10" :xl="10">
      <div class='avatar'>
        <el-avatar :size="100" :src="user.avatar"></el-avatar>
      </div>
    </el-col>
    <el-col class="right" :xs="14" :sm="14" :md="14" :lg="14" :xl="14">
      <div class="detail">
        <div class="user-item">
          <i class="el-icon-user"></i>
          <span>{{user.name}}</span>
        </div>
        <div class="user-item">
          <i class="el-icon-setting"></i>
          <span>{{user.role == 'admin' ? '管理员' : '员工'}}</span>
        </div>
        <div class="user-item" style="text-align: center;">
          <el-button type="danger" @click="logout">退出登录<i class="el-icon-close el-icon--right"></i></el-button>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: 'userinfo',
  computed: {
    user() {
      return this.$store.getters.user
    }
  },
  methods: {
    logout() {
      // 清除token
      localStorage.removeItem('token')
      this.$store.dispatch('clearCurrentState')
      // 页面跳转
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="stylus" scoped>
.user-info
  width 100%
  height 100%
  display flex
  .left, .right
    display flex
    justify-content center
    align-items center
    height 100%
  .right
    flex 1
    background-color #eee
    .detail
      .user-item
        height 90px
        font-size 28px
        line-height 90px
        span
          margin-left 5px
@media screen and (max-width 500px)
  .user-info
    .left
      display none
</style>
