<template>
  <el-menu class="left-wrapper" default-active="1" :collapse="isFold"
    background-color="#304156"
    text-color="rgb(191, 203, 217)"
    active-text-color="rgb(64, 158, 255)">
    <router-link to="/dashboard">
      <el-menu-item index="0">
        <i class="el-icon-menu"></i>
        <span slot="title">Dashboard</span>
      </el-menu-item>
    </router-link>
    <template  v-for="item in items">
      <el-submenu v-if="item.children" :index="item.path" :key="item.path">
        <template slot="title">
          <i :class="item.icon"></i>
          <span slot="title">{{item.name}}</span>
        </template>
        <router-link
          v-for="(citem,cindex) in item.children"
          :to="citem.path"
          :key="cindex">
          <el-menu-item :index='citem.path'>
            <span slot="title">{{citem.name}}</span>
          </el-menu-item>
        </router-link>
      </el-submenu>
    </template>
    <router-link to="/userinfo">
      <el-menu-item index="3">
        <i class="el-icon-user"></i>
        <span slot="title">个人中心</span>
      </el-menu-item>
    </router-link>
  </el-menu>
</template>

<script>
export default {
  name: 'leftmenu',
  data() {
    return {
      items: [
        {
          icon: 'el-icon-goods',
          name: '商品',
          path: 'fund',
          children: [{ path: 'categorylist', name: '商品分类' }, { path: 'goodslist', name: '商品列表' }]
        }
      ]
    }
  },
  computed: {
    user() {
      return this.$store.getters.user
    }
  },
  props: {
    isFold: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="stylus" scoped>
.left-wrapper
  &:not(.el-menu--collapse)
    width 200px
    min-height 400px
</style>
