<template>
  <div class="category-select">
    <!-- 一级菜单 -->
    <el-select v-model="cate_id" placeholder="请选择" @change="cateChange">
      <el-option
        v-for="item in cateList" :key="item.cate_id"
        :label="item.name" :value="item.cate_id">
      </el-option>
    </el-select>
    <!-- 二级菜单 -->
    <el-select class="sub-cate" v-model="sub_cate_id" placeholder="请选择" @change="subCateChange">
      <el-option
        v-for="item in subCateList" :key="item.cate_id"
        :label="item.name" :value="item.cate_id">
      </el-option>
    </el-select>
  </div>
</template>

<script>
import { getCategory } from '../api/index'

export default {
  data() {
    return {
      allList: [], // 分类集合（包含一二级）
      cateList: [], // 一级分类
      subCateList: [], // 二级分类
      cate_id: '', // 当前一级分类ID
      sub_cate_id: '' // 当前二级分类ID
    }
  },
  props: {
    subCateId: { // 在商品详情页进行编辑时会传递二级分类，此时需要根据二级分类ID计算一级分类
      type: String,
      default: ''
    }
  },
  mounted() {
    this._getCategoryList()
  },
  methods: {
    // 获取分类信息
    _getCategoryList() {
      getCategory().then(data => {
        // 将整个分类存起来
        this.allList = data
        // 设置默认状态下一二级分类各自的数据
        this.cateList = data.filter(v => v.parent_id === '0')
        this.subCateList = data.filter(v => v.parent_id === this.cateList[0].cate_id)
        // 默认选中状态
        this.cate_id = '1'
        this.sub_cate_id = this.subCateList[0].cate_id
        this.$emit('cateloaded', this.sub_cate_id)
      })
    },
    // 一级分类改变
    cateChange(value) {
      this.cate_id = value
      this.subCateList = this.allList.filter(v => v.parent_id === value)
      this.sub_cate_id = this.subCateList[0].cate_id
      this.$emit('catechange', this.sub_cate_id)
    },
    // 二级分类改变
    subCateChange(value) {
      this.sub_cate_id = value
      this.$emit('catechange', this.sub_cate_id)
    }
  },
  watch: {
    // 监听subCateId是否有值，有则代表是编辑页，需高亮相应id的分类
    subCateId(newValue) {
      // 重新设置一二级分类各自的数据
      // 1. 找到该二级分类
      const subCateObj = this.allList.find(v => v.cate_id === newValue)
      // 2. 找到相应的一级分类
      const cateObj = this.allList.find(v => v.cate_id === subCateObj.parent_id)
      // 3. 设置一级分类高亮
      this.cate_id = cateObj.cate_id
      // 4. 设置二级分类列表
      this.subCateList = this.allList.filter(v => v.parent_id === cateObj.cate_id)
      // 5. 设置二级分类高亮
      this.sub_cate_id = newValue
    }
  }
}
</script>

<style lang="stylus" scoped>
.sub-cate
  margin-left 20px
@media screen and (max-width 500px)
  .sub-cate
    margin-left 0
</style>
