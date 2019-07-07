<template>
  <el-pagination
    class="swpagination"
    background
    @current-change="handleCurrentChange"
    :current-page.sync="curPage"
    :page-sizes="[display, display*2, display*4, display*6]"
    :page-size="display"
    layout="total, prev, pager, next, jumper"
    :total="total">
    <!-- @size-change="handleSizeChange"
    layout="total, sizes, prev, pager, next, jumper" 每页多少条 -->
  </el-pagination>
</template>

<script>
export default {
  data() {
    return {
      curPage: 1
    }
  },
  mounted() {
    this.curPage = this.currentPage
  },
  methods: {
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.$emit('change-curPage', val)
    }
  },
  watch: {
    currentPage(val, oldVal) {
      console.log('new: %s, old: %s', val, oldVal)
      this.curPage = val
    }
  },
  props: {
    total: { // 总条数
      type: Number,
      default: 0
    },
    display: {// 每页显示条数
      type: Number,
      default: 15
    },
    currentPage: {// 当前页码
      type: Number,
      default: 1
    }
  }
}
</script>

<style lang="stylus" scoped>
.swpagination
  padding: 20px 0 5px 0;
  text-align: center;
</style>
