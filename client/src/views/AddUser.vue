<template>
  <div class="form-wrapper">
    <!-- 返回首页 -->
    <div>
      <el-form :inline="true" ref="edit_data">
        <el-button icon="el-icon-arrow-left" size="small" circle @click="goBack"></el-button>
      </el-form>
    </div>
    <div class="form">
      <el-form :model="userForm" :rules="rules" ref="userForm" label-width="100px" class="demo-userForm">
        <el-form-item label="昵称" prop="name">
          <el-input v-model="userForm.name"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
            <el-input v-model="userForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="userForm.role" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('userForm')">添加管理员</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { addUser } from '../api/index'

export default {
  data() {
    return {
      userForm: {
        name: '',
        password: '',
        role: ''
      },
      options: [{
        value: 'employee',
        label: '员工'
      }, {
        value: 'admin',
        label: '管理员'
      }],
      rules: {
        email: [
          { type: 'email', required: true, message: '邮箱格式不正确', trigger: 'change' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, max: 30, message: '长度在 6 到 30 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 表单提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) return
        addUser(this.userForm).then(() => {
          this.$router.push({ name: 'dashboard' })
        })
      })
    },
    // 返回列表
    goBack() {
      this.$router.go(-1)
    }
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
