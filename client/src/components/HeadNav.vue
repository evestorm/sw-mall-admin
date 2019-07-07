<template>
  <div class="head-nav">
    <el-row>
      <!-- 左侧隐藏侧边栏的按钮 -->
      <el-col :span="2" class="hide-menu">
        <el-button @click="triggerAside" type="text" :icon="foldIcon"></el-button>
      </el-col>
      <el-col :span="10" class="breadcrumb">
        <breadcrumb></breadcrumb>
      </el-col>
      <!-- 右边管理员信息展示 -->
      <el-col :span="12" class="user">
        <div class="user-info" @click="setDialogInfo">
          <!-- 下拉箭头 -->
          <span class="more">
            <el-dropdown
              trigger="click"
              @command='setDialogInfo'>
                <span class="el-dropdown-link">
                  <el-avatar :src="user.avatar" class="avatar" icon="el-icon-user-solid"></el-avatar>
                  <div class="welcome">
                    <div class="name comename">欢迎</div>
                    <div class="name avatarname">{{user.name}}</div>
                  </div>
                  <i class="el-icon-caret-bottom el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command='info'>个人信息</el-dropdown-item>
                    <el-dropdown-item  command='logout'>退出</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
          </span>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Breadcrumb from '../components/Breadcrumb'
export default {
  name: 'headnav',
  data() {
    return {
      isFold: false // 默认不折叠
    }
  },
  mounted() {
    // 移动设备访问页面时，默认侧边栏是折叠状态
    if (this.getViewportSize().width <= 500) {
      this.isFold = true
      this.$emit('headNavFold', this.isFold)
    }
  },
  methods: {
    // 显示隐藏侧边栏
    triggerAside() {
      this.isFold = !this.isFold
      this.$emit('headNavFold', this.isFold)
    },
    setDialogInfo(cmditem) {
      if (!cmditem) {
        this.$message('菜单选项缺少command属性')
        return
      }
      switch (cmditem) {
        case 'info':
          this.showInfoList()
          break
        case 'logout':
          this.logout()
          break
      }
    },
    showInfoList() {
      // 个人信息
      this.$router.push('/userinfo')
    },
    logout() {
      // 清除token
      localStorage.removeItem('token')
      this.$store.dispatch('clearCurrentState')

      // 页面跳转
      this.$router.push('/login')
    }
  },
  computed: {
    // 设置隐藏侧边栏按钮的 icon
    foldIcon() {
      return !this.isFold ? 'el-icon-s-fold' : 'el-icon-s-unfold'
    },
    // 获取用户信息
    user() {
      return this.$store.getters.user
    }
  },
  components: {
    Breadcrumb
  }
}
</script>

<style lang="stylus">
.head-nav
  .hide-menu
    button
      color black
      font-size 24px
      padding-top 15px
  .breadcrumb
    .el-breadcrumb__item
      line-height 56px
  .user
    position relative
    line-height 56px
    text-align right
    float right
    .more
      cursor pointer
      margin-right 5px
      .avatar
        width 40px
        height 40px
        border-radius 50%
        vertical-align middle
      .welcome
        display inline-block
        width auto
        vertical-align middle
        padding 0 5px
        .name
          line-height 20px
          text-align center
          font-size 14px
        .comename
          font-size 12px
        .avatarname
          color #409eff
          margin-right 5px
    .el-dropdown
      color black
@media screen and (max-width 500px)
  .welcome, .breadcrumb
    display none !important
  .more
    position absolute
    right -20px
    top 0
</style>
