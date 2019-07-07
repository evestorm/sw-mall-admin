<template>
  <div class="table-wrapper">
    <div>
      <el-form
        :inline="true" ref="search_data"
        :model='search_data'>
        <el-form-item label="选择分类">
          <category-select @cateloaded="initSubCate" @catechange="changeSubCate"></category-select>
        </el-form-item>
        <el-form-item label="创建时间">
            <el-date-picker
              v-model="search_data.ptime"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions">
            </el-date-picker>
        </el-form-item>
        <el-form-item  label="名称关键词">
          <el-input v-model="search_data.keywords" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item class="btnRight">
          <el-tooltip :disabled="isAdmin" content="非管理员无法添加商品" placement="top" effect="light">
            <el-button type="primary" size ="small" icon="view" @click='onAddGoods()' :disabled="!isAdmin">添加</el-button>
          </el-tooltip>
        </el-form-item>
        <el-form-item class="btnRight">
            <el-button type="primary" size ="small" icon="search" @click='onFilter()'>筛选</el-button>
        </el-form-item>
    </el-form>
    </div>
    <div class="table">
      <el-table
        :data="tableData" style="width: 100%"
        stripe border max-height="450"
        :default-sort="{prop: 'date', order: 'descending'}">
        <el-table-column label="ID" align="center" v-if="false">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.ID }}</span>
          </template>
        </el-table-column>
        <el-table-column label="名称" align="center">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.NAME }}</span>
          </template>
        </el-table-column>
        <el-table-column label="缩略图" align="center">
          <template slot-scope="scope">
            <span style="margin-left: 10px"><img :src="scope.row.IMAGE1" width="25px"></span>
          </template>
        </el-table-column>
        <el-table-column label="原价" align="center">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.ORI_PRICE }}元</span>
          </template>
        </el-table-column>
        <el-table-column label="现价" align="center">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.PRESENT_PRICE }}元</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <span style="margin-left: 10px">
              <el-tag
                :type="scope.row.STATE === 1 ? 'success' : 'danger'"
                disable-transitions>{{scope.row.STATE === 1 ? '正常' : '下架'}}</el-tag>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="首页推荐" align="center">
          <template slot-scope="scope">
            <span style="margin-left: 10px">
              <el-tag
                :type="scope.row.IS_RECOMMEND === 1 ? 'danger' : 'info'"
                disable-transitions>{{scope.row.IS_RECOMMEND === 1 ? '是' : '否'}}</el-tag>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="库存" align="center" sortable :sort-method="sortByAmount">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.AMOUNT }}</span>
          </template>
        </el-table-column>
        <el-table-column label="已售" align="center" sortable :sort-method="sortBySales">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.SALES_COUNT }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" sortable prop="date" :sort-method="sortByDate">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.formateDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" fixed="right" min-width="150">
          <template slot-scope="scope">
            <el-tooltip :disabled="isAdmin" content="非管理员无法编辑分类" placement="top" effect="light">
              <el-button size="mini"
                :disabled="!isAdmin"
                @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            </el-tooltip>
            <el-tooltip :disabled="isAdmin" content="非管理员无法删除分类" placement="top" effect="light">
              <el-button size="mini" type="danger"
                :disabled="!isAdmin"
                @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <StandardPagination
        :total="allCount"
        :display="15"
        :currentPage="currentPage"
        @change-curPage="changeCurPage"></StandardPagination>
    </div>
  </div>
</template>

<script>
import { getGoods, deleteGoods } from '../api/index'

import CategorySelect from '../components/CategorySelect'
import StandardPagination from '../components/StandardPagination'
import { formatTime } from '../utils'

const shortcuts = [{
  text: '最近一周',
  onClick(picker) {
    const end = new Date()
    const start = new Date()
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
    picker.$emit('pick', [start, end])
  }
}, {
  text: '最近一个月',
  onClick(picker) {
    const end = new Date()
    const start = new Date()
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
    picker.$emit('pick', [start, end])
  }
}, {
  text: '最近三个月',
  onClick(picker) {
    const end = new Date()
    const start = new Date()
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
    picker.$emit('pick', [start, end])
  }
}]
export default {
  data() {
    return {
      tableData: [], // 商品列表数据
      allCount: 0, // 数据总数
      currentPage: 1, // 当前页
      search_data: {
        sub_cate_id: '', // 当前选中的二级分类
        ptime: [], // 创建时间的筛选
        keywords: '' // 标题关键词
      },
      pickerOptions: {
        shortcuts
      }
    }
  },
  methods: {
    // 获取商品列表信息
    _getGoodsList() {
      console.log(this.search_data)
      const ptime = this.search_data.ptime
      let params = {
        page: this.currentPage,
        SUB_ID: this.search_data.sub_cate_id,
        stime: ptime && ptime.length > 0 ? ptime[0] : '',
        etime: ptime && ptime.length > 0 ? ptime[1] : '',
        keywords: this.search_data.keywords
      }
      getGoods({ params }).then(data => {
        const { allCount, results } = data
        this.allCount = allCount
        this.tableData = results.map(v => {
          // 对后台返回的时间进行格式化（时区+8小时）
          // 2018-07-13T12:21:44.000Z => 2018/07/13 20:12:43
          const date = new Date(v.CREATE_TIME)
          v.formateDate = formatTime(date)
          return v
        })
      })
    },
    // 点击分页后触发
    changeCurPage(page) {
      this.currentPage = page
      this._getGoodsList()
    },
    // 初始化当前二级分类
    initSubCate(value) {
      console.log(value)
      this.search_data.sub_cate_id = value
      this._getGoodsList()
    },
    // 监听当前二级分类
    changeSubCate(value) {
      console.log(value)
      this.search_data.sub_cate_id = value
    },
    // 点击筛选按钮
    onFilter() {
      this._getGoodsList()
    },
    // 添加商品
    onAddGoods() {
      console.log('添加')
      this.$router.push({ name: 'goodsdetail', params: { ID: 'add' } })
    },
    // 编辑某个商品
    handleEdit(index, row) {
      console.log(index, row)
      console.log('编辑')
      this.$router.push({ name: 'goodsdetail', params: { ID: row.ID } })
    },
    // 删除某个商品
    handleDelete(index, row) {
      console.log(index, row)
      console.log('删除')
      // 弹窗确认
      this.$msgbox.confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteGoods(row.ID)().then(() => {
          this.$message({
            message: '删除成功！',
            type: 'success'
          })
          this._getGoodsList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // ======== 表格排序方法 ==========
    sortByAmount(a, b) {
      return a.SALES_COUNT - b.SALES_COUNT
    },
    sortBySales(a, b) {
      return a.SALES_COUNT - b.SALES_COUNT
    },
    sortByDate(a, b) {
      return new Date(a.CREATE_TIME).getTime() - new Date(b.CREATE_TIME).getTime()
    }
  },
  computed: {
    // 检查是否为管理员
    isAdmin() {
      return this.$store.getters.user.role === 'admin'
    }
  },
  components: {
    CategorySelect,
    StandardPagination
  }
}
</script>

<style lang="stylus" scoped>
.table-wrapper
  padding 20px
  .btnRight
    float right
</style>
