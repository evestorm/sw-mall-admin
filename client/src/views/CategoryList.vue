<template>
  <div class="table-wrapper">
    <div>
      <el-form :inline="true" ref="add_data">
        <el-form-item class="btnRight">
          <el-tooltip :disabled="isAdmin" content="非管理员无法添加分类" placement="top" effect="light">
            <el-button class="btnRight" type="primary" size="small" icon="view" @click="handleAdd" :disabled="!isAdmin">添加</el-button>
          </el-tooltip>
        </el-form-item>
      </el-form>
    </div>
    <div class="table">
      <el-table :data="tableData" style="width: 100%" stripe border>
        <el-table-column label="cate_id" align="center" v-if="false">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.cate_id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="名称" align="center">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="图标" align="center">
          <template slot-scope="scope">
            <span style="margin-left: 10px"><img :src="scope.row.image" width="25px"></span>
          </template>
        </el-table-column>
        <el-table-column label="优先级" align="center">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.sort }}</span>
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
    </div>
    <!-- 弹框页面 -->
    <SWDialog :options='options' :form='form' @dialogUpdate="_getCategoryList" ref="swDialog"></SWDialog>
  </div>
</template>

<script>
import { getCategory, deleteCategory } from '../api/index'
import SWDialog from '../components/SWDialog'

export default {
  data() {
    return {
      tableData: [], // 商品一级分类数据
      options: {
        show: false,
        title: '',
        type: ''
      },
      form: {
        cate_id: '',
        name: '',
        image: '',
        sort: 0
      }
    }
  },
  mounted() {
    this._getCategoryList()
  },
  methods: {
    // 获取商品一级分类信息
    _getCategoryList() {
      getCategory().then(data => {
        this.tableData = data.filter(v => v.parent_id === '0')
      })
    },
    // 编辑分类
    handleEdit(index, row) {
      this.options = {
        show: true,
        title: '编辑一级分类',
        type: 'edit'
      }
      this.form = {
        cate_id: row.cate_id,
        name: row.name,
        image: row.image,
        sort: row.sort
      }
    },
    // 删除分类
    handleDelete(index, row) {
      // 弹窗确认
      this.$msgbox.confirm('此操作将永久删除该一级分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteCategory(row.cate_id)().then(() => {
          this.$message({
            message: '删除成功！',
            type: 'success'
          })
          this.$refs.swDialog.show = false
          this._getCategoryList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 添加分类
    handleAdd() {
      this.options = {
        show: true,
        title: '添加一级分类',
        type: 'add'
      }
      this.form = {
        name: '',
        image: '',
        sort: 0
      }
    }
  },
  computed: {
    isAdmin() {
      return this.$store.getters.user.role === 'admin'
    }
  },
  components: {
    SWDialog
  }
}
</script>

<style lang="stylus" scoped>
.table-wrapper
  padding 20px
  .btnRight
    float right
</style>
