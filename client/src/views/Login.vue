<template>
  <div class="login">
    <section class="form-container">
      <div class="title-wrapper">
        <h1 class="brand">商城后台管理系统</h1>
        <h3 class="name">登录</h3>
      </div>
      <el-form :model="loginUser" :rules="rules" ref="loginForm" class="login-form">
        <el-form-item prop="email">
            <el-input v-model="loginUser.email" prefix-icon="el-icon-user" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item prop="password">
            <el-input v-model="loginUser.password" prefix-icon="el-icon-lock" placeholder="请输入密码" type="password"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary"  @click="login('loginForm')" class="login-btn">登  录</el-button>
        </el-form-item>
      </el-form>
    </section>
  </div>
</template>

<script>
import { postLogin } from '../api'
import jwtDecode from 'jwt-decode'
import { isEmpty } from '../utils/index'

export default {
  name: 'login',
  data() {
    return {
      loginUser: {
        email: '',
        password: ''
      },
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
    login(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          postLogin(this.loginUser).then(data => {
            // 登录成功
            const { token } = data
            localStorage.setItem('token', token)
            // 解析token
            const decode = jwtDecode(token)
            // 存储数据
            this.$store.dispatch('setAuthenticated', isEmpty(decode))
            this.$store.dispatch('setUser', decode)
            // 页面跳转
            this.$router.push('/index')
          }).catch(() => {})
        }
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.login
  position relative
  background-color #2d3a4b
  width 100%
  height 100%
  color white
  .form-container
    position absolute
    max-width 320px
    left 0
    top 24%
    right 0
    bottom 0
    margin auto
    text-align center
    .title-wrapper
      .brand
        font-size 26px
        padding-bottom 20px
        font-weight bold
      .name
        font-size 20px
    .login-form
      margin-top 20px
      border-radius 5px
      .login-btn
        width 100%
</style>
