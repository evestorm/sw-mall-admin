<template>
  <div class="breadcrumb-container">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item v-for="(item, index) in breadList" :key="index" :to="{ path: item.path }">{{item.meta.title}}
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  data() {
    return {
      breadList: [] // 路由集合
    }
  },
  watch: {
    $route() {
      this.getBreadcrumb()
    }
  },
  methods: {
    isHome(route) {
      return route.name === 'index'
    },
    getBreadcrumb() {
      let matched = this.$route.matched
      // 如果不是首页
      if (!this.isHome(matched[0])) {
        matched = [{ path: '/dashboard', meta: { title: 'Dashboard' } }].concat(matched)
      }
      this.breadList = matched
    }
  },
  created() {
    this.getBreadcrumb()
  }
}
</script>

<style lang="stylus" scoped>

</style>
