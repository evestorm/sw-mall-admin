<template>
  <div class="form-wrapper">
    <!-- 返回列表页 -->
    <div>
      <el-form :inline="true" ref="edit_data">
        <el-button icon="el-icon-arrow-left" size="small" circle @click="goBack"></el-button>
      </el-form>
    </div>
    <div class="form">
      <el-form :model="detailForm" :rules="rules" ref="detailForm" label-width="100px" class="demo-detailForm">
        <el-form-item label="ID" v-if="false" prop="ID">
          <el-input v-model="detailForm.ID"></el-input>
        </el-form-item>
        <el-form-item label="SUB_ID" v-if="false" prop="SUB_ID">
          <el-input v-model="detailForm.SUB_ID"></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="NAME">
          <el-input v-model="detailForm.NAME"></el-input>
        </el-form-item>
        <el-form-item label="图片:" ref="uploadEle" prop="IMAGE1">
          <el-image
            v-if="detailForm.IMAGE1"
            style="width: 100px; height: 100px"
            :src="detailForm.IMAGE1"
            fit="fit"></el-image>
          <el-upload
            class="img-uploader"
            action=""
            :multiple="false"
            :auto-upload="false"
            :fill-list="fileList"
            :on-change="handleChange">
            <el-button size="small" type="primary">点击上传</el-button>
            <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过1Mb</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="选择分类">
          <category-select :subCateId="detailForm.SUB_ID" @cateloaded="initSubCate" @catechange="changeSubCate"></category-select>
        </el-form-item>
        <el-form-item label="原价" prop="ORI_PRICE">
          <el-input type="number" v-model="detailForm.ORI_PRICE"></el-input>
        </el-form-item>
        <el-form-item label="现价" prop="PRESENT_PRICE">
          <el-input type="number" v-model="detailForm.PRESENT_PRICE"></el-input>
        </el-form-item>
        <el-form-item label="库存" prop="AMOUNT">
          <el-input type="number" v-model="detailForm.AMOUNT"></el-input>
        </el-form-item>
        <el-form-item label="已售" prop="SALES_COUNT">
          <el-input type="number" v-model="detailForm.SALES_COUNT"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="STATE">
          <!-- switch默认值为true/false。如果数据库设定0/1为真假，则需设置 active-value=1 inactive-value=0 -->
          <el-switch v-model="detailForm.STATE" :active-value=1 :inactive-value=0></el-switch>
        </el-form-item>
        <el-form-item label="首页推荐" prop="IS_RECOMMEND">
          <el-switch v-model="detailForm.IS_RECOMMEND" :active-value=1 :inactive-value=0></el-switch>
        </el-form-item>
        <el-form-item label="创建时间">
          <!-- format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            表示时间展示以及值的格式都为GMT -->
          <el-date-picker
            v-model="detailForm.CREATE_TIME"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="更新时间">
          <el-date-picker
            v-model="detailForm.UPDATE_TIME"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="商品详情" prop="DETAIL">
          <tinymce-editor
            v-model="detailForm.DETAIL"
            ref="editor"
            @onClick="onClick"></tinymce-editor>
          <el-button size="mini" @click="clear" style="margin-top: 5px; float: right;">清空内容</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('detailForm')">立即{{this.type === 'edit' ? '更新' : '添加'}}</el-button>
          <el-button @click="resetForm('detailForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { getGoodsDetail, addGoods, editGoods, uploadImg } from '../api/index'

import CategorySelect from '../components/CategorySelect'
import TinymceEditor from '../components/TinymceEditor' // 富文本编辑器

import { eosFormatTime } from '../utils'

export default {
  data() {
    return {
      type: 'edit', // 当前是编辑还是添加
      detailForm: {
        ID: '',
        SUB_ID: '',
        NAME: '',
        IMAGE1: '',
        ORI_PRICE: 0,
        PRESENT_PRICE: 0,
        AMOUNT: 0,
        SALES_COUNT: 0,
        STATE: 1,
        IS_RECOMMEND: 0,
        CREATE_TIME: new Date(),
        UPDATE_TIME: new Date(),
        DETAIL: ''
      },
      fileList: [], // 上传图片列表
      rules: {
        NAME: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        ORI_PRICE: [
          { required: true, message: '原价不能为空', trigger: 'blur' }
        ],
        PRESENT_PRICE: [
          { required: true, message: '现价不能为空', trigger: 'blur' }
        ],
        AMOUNT: [
          { required: true, message: '库存不能为空', trigger: 'blur' }
        ],
        SALES_COUNT: [
          { required: true, message: '已售数量不能为空', trigger: 'blur' }
        ],
        CREATE_TIME: [
          { type: 'date', required: true, message: '请选择创建时间', trigger: 'change' }
        ],
        UPDATE_TIME: [
          { type: 'date', required: true, message: '请选择更新时间', trigger: 'change' }
        ],
        DETAIL: [
          { required: true, message: '请填写商品详情', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 获取商品详情
    _getGoodsDetail() {
      getGoodsDetail(this.detailForm.ID)().then(data => {
        this.detailForm = data.results
        // 把UTC格式转为GMT
        this.detailForm.CREATE_TIME = eosFormatTime(this.detailForm.CREATE_TIME)
        this.detailForm.UPDATE_TIME = eosFormatTime(this.detailForm.UPDATE_TIME)
      })
    },
    // 表单提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.detailForm)
          // 检测是否上传了图片
          console.log(this.fileList.length)
          if (this.fileList.length === 0 && !this.detailForm.IMAGE1) {
            this.$message.error('请上传图片！')
            return false
          }
          if (this.type === 'add') {
            // 把UTC格式转为GMT
            this.detailForm.CREATE_TIME = eosFormatTime(this.detailForm.CREATE_TIME)
            this.detailForm.UPDATE_TIME = eosFormatTime(this.detailForm.UPDATE_TIME)
            addGoods(this.detailForm).then(() => {
              this.$router.push({ name: 'goodslist' })
            })
          } else {
            // 用户点击「立即更新」时再更新时间
            const date = new Date()
            this.detailForm.UPDATE_TIME = eosFormatTime(date.toISOString())
            editGoods(this.detailForm.ID)(this.detailForm).then(() => {
              console.log(this.detailForm)
              this.$message({
                message: '更新成功！',
                type: 'success'
              })
              this.$router.push({ name: 'goodslist' })
            })
          }
        } else {
          console.log('未通过表单验证，请查看表单是否符合要求！')
          return false
        }
      })
    },
    // 重置表单
    resetForm(formName) {
      this.fileList = []
      this.$refs[formName].resetFields()
    },
    // 校验图片文件后上传（选择完图片后触发）
    handleChange(file) {
      const isIMAGE = (file.raw.type === 'image/jpeg' || file.raw.type === 'image/jpg' || file.raw.type === 'image/png')
      const isLt1M = file.size / 1024 / 1024 < 1

      if (!isIMAGE) {
        this.$message.error('上传文件只能是图片格式!')
        return false
      }
      if (!isLt1M) {
        this.$message.error('上传文件大小不能超过 1MB!')
        return false
      }
      this.fileList = [file.raw]
      console.log(this.fileList)
      this._uploadImg()
    },
    // 上传图片
    _uploadImg() {
      let formData = new FormData()
      formData.append('imgFile', this.fileList[0])
      let config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      uploadImg(formData, config).then(data => {
        this.detailForm.IMAGE1 = data
        this.$message.success('上传图片成功！')
      })
    },
    // 初始化当前二级分类
    initSubCate(value) {
      // 路由参数ID为add代表添加，否则代表新增
      if (this.$route.params.ID === 'add') {
        this.type = 'add'
        this.detailForm.SUB_ID = value
      } else {
        this.type = 'edit'
        this.detailForm.ID = this.$route.params.ID || ''
        this._getGoodsDetail()
      }
    },
    // 监听当前二级分类
    changeSubCate(value) {
      console.log(value)
      this.detailForm.SUB_ID = value
    },
    // 鼠标单击的事件
    onClick(e, editor) {
      console.log('Element clicked')
      console.log(e)
      console.log(editor)
    },
    // 清空内容
    clear() {
      this.$refs.editor.clear()
    },
    // 返回列表
    goBack() {
      this.$router.go(-1)
    }
  },
  computed: {
    isAdmin() {
      return this.$store.getters.user.role === 'admin'
    }
  },
  components: {
    CategorySelect,
    TinymceEditor
  }
}
</script>

<style lang="stylus" scoped>
.form-wrapper
  padding 20px
  .btnRight
    float right
  .form
    margin-top 20px
</style>
