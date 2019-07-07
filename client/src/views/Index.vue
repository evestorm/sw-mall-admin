<template>
  <el-container class="index" style="height: 100%; border: 1px solid #eee">
    <!-- 侧边栏（:collapse="isFold"控制折叠） -->
    <left-menu :isFold="isFold"></left-menu>
    <!-- 右侧部分 -->
    <el-container class="right-wrapper">
      <!-- 顶部导航栏 -->
      <el-header class="header">
        <!-- 显示或隐藏侧边栏按钮 -->
        <head-nav @headNavFold="swFold"></head-nav>
      </el-header>
      <!-- 主体 -->
      <el-main class="main-wrapper">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import HeadNav from '../components/HeadNav'
import LeftMenu from '../components/LeftMenu'

export default {
  name: 'index',
  data() {
    return {
      isFold: false // 默认不折叠
    }
  },
  methods: {
    swFold(isFold) {
      this.isFold = isFold
    }
  },
  components: {
    HeadNav,
    LeftMenu
  }
}
</script>

<style lang="stylus" scoped>
.index
  .right-wrapper
    .header
      background-color #fff
      box-shadow: 0 1px 4px rgba(0,21,41,.08)
      color black
      line-height 56px
      height 56px !important
    .el-main
      padding 0
</style>
