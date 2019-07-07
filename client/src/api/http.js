import axios from 'axios'
import router from '../router'
import { Message, Loading } from 'element-ui'

let loading

// 请求拦截  设置统一header
axios.interceptors.request.use(config => {
  // 加载
  startLoading()
  if (localStorage.token) {
    config.headers.Authorization = localStorage.token
  }
  return config
}, error => {
  return Promise.reject(error)
})

// 响应拦截  401 token过期处理（处理 status）
axios.interceptors.response.use(response => {
  endLoading()
  return response
}, error => {
  // console.log(error.response.data)
  // 错误提醒
  endLoading()

  const { status } = error.response
  if (status === 401) {
    Message.error('token值无效，请重新登录')
    // 清除token
    localStorage.removeItem('token')
    // 页面跳转
    router.push('/login')
  } else {
    Message.error(error.response.data.message)
  }

  return Promise.reject(error)
})

// 使用 element-ui 的 Loading 组件方法
function startLoading() {
  loading = Loading.service({
    lock: true,
    text: '加载中...',
    background: 'rgba(0, 0, 0, .7)'
  })
}

function endLoading() {
  loading.close()
}

export default axios
