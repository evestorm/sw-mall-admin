<template>
  <div class="dialog">
    <el-dialog
      :title="options.title"
      :visible.sync="options.show"
      :close-on-click-modal='false'
      :close-on-press-escape='false'
      :modal-append-to-body='false'>
      <div class="form">
        <el-form
          ref="form"
          :model="form"
          :rules="form_rules"
          label-width="120px"
          style="margin:10px;width:auto;">
          <el-form-item prop='name' label="分类标题:" >
            <el-input type="text" v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item prop='image' label="图标:" ref="uploadEle">
            <el-image
              v-if="selfForm.image"
              style="width: 100px; height: 100px"
              :src="selfForm.image"
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
          <el-form-item prop='sort' label="优先级:">
              <el-input type="number" v-model="form.sort"></el-input>
          </el-form-item>

          <el-form-item  class="text_right">
              <el-button @click="options.show = false">取 消</el-button>
              <el-button type="primary" @click='onSubmit("form")'>提  交</el-button>
          </el-form-item>

        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addCategory, editCategory, uploadImg } from '../api/index'
export default {
  name: 'sw-dialog',
  props: {
    options: {
      type: Object,
      default() {
        return {}
      }
    },
    form: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      form_rules: {
        name: [
          { required: true, message: '分类名称不能为空！', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '优先级不能为空', trigger: 'blur' }
        ]
      },
      selfForm: {}, // 表单数据
      fileList: [] // 上传图片列表
    }
  },
  methods: {
    // 表单提交
    onSubmit(form) {
      // 校验表单数据
      this.$refs[form].validate(async valid => {
        if (valid) {
          // 根据父组件传递的type决定执行「添加」or「编辑」
          if (this.options.type === 'add') {
            if (this.fileList.length === 0) {
              this.$message.error('请上传图标！')
              return false
            }
            await this.uploadImg()
            this._addCategory()
          } else {
            if (this.fileList.length > 0) {
              await this.uploadImg()
            }
            this._editCategory()
          }
        }
      })
    },
    // 校验图片文件（选择完图片后触发）
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
    },
    // 添加分类
    _addCategory() {
      addCategory(this.selfForm).then(() => {
        this.$message({
          message: '保存成功！',
          type: 'success'
        })
        this.options.show = false
        this.$emit('dialogUpdate')
      })
    },
    // 编辑分类
    _editCategory() {
      editCategory(this.selfForm.cate_id)(this.selfForm).then(() => {
        this.$message({
          message: '更新成功！',
          type: 'success'
        })
        this.options.show = false
        this.$emit('dialogUpdate')
      })
    },
    // 上传图片
    uploadImg() {
      return new Promise((resolve, reject) => {
        let formData = new FormData()
        formData.append('imgFile', this.fileList[0])
        let config = {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
        uploadImg(formData, config).then(data => {
          this.fileList = []
          this.selfForm.image = data
          resolve()
        }).catch((err) => reject(new Error(err)))
      })
    }
  },
  watch: {
    form: {
      immediate: true,
      deep: true,
      handler(newValue) {
        this.selfForm = newValue
        console.log(this.selfForm)
      }
    }
  }
}
</script>

<style lang="stylus">
@media screen and (max-width 500px)
  .dialog
    .el-dialog
      width 90% !important
</style>
