<template>
  <div class="notfound">
    <div class="center-img">
      <img src="../assets/404.png" alt="404 page">
      <router-link to="index" class="gohome"> ➤ 返回首页</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'notfound'
}
</script>

<style lang="stylus" scoped>
.notfound
  position relative
  width 100%
  height 100%
  overflow hidden
  .center-img
    position absolute
    top 50%
    left 50%
    transform translate(-50%, -50%)
    img
      width 100%
      height 100%
      min-width 200px
    .gohome
      position absolute
      right 0
      bottom 0
</style>
