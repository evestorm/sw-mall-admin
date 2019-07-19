import { request } from './request'

// 这是开发环境和线上环境的接口配置
const baseURL = process.env.NODE_ENV === 'production'
  ? 'http://mall.evelance.cn:7001/admin/'
  : 'http://localhost:7001/admin/'

const POST = 'post'

// const postLogin = request(`${baseURL}/login`, POST)
const postLogin = request(`${baseURL}login`, POST) // 登录
const getUser = request(`${baseURL}user`) // 获取管理员信息
const addUser = request(`${baseURL}register`, POST) // 注册管理员
const getSiteInfo = request(`${baseURL}siteinfo`) // 获取首页信息
const getCategory = request(`${baseURL}category`) // 获取商品分类信息
const addCategory = request(`${baseURL}category/add`, POST) // 新增商品分类
const editCategory = function(ID) {
  return request(`${baseURL}category/edit/${ID}`, POST) // 更新商品分类
}
const deleteCategory = function(ID) {
  return request(`${baseURL}category/delete/${ID}`, POST) // 删除商品分类
}
const uploadImg = request(`${baseURL}form/upload/`, POST) // 上传图片
const getGoods = request(`${baseURL}goods`) // 获取商品列表
const getGoodsDetail = function(ID) {
  return request(`${baseURL}goods/detail/${ID}`) // 获取商品详情
}
const addGoods = request(`${baseURL}goods/add`, POST) // 新增商品
const editGoods = function (ID) {
  return request(`${baseURL}goods/edit/${ID}`, POST) // 更新商品
}
const deleteGoods = function (ID) {
  return request(`${baseURL}goods/delete/${ID}`, POST) // 删除商品
}

export {
  postLogin,
  getUser,
  addUser,
  getSiteInfo,
  getCategory,
  addCategory,
  editCategory,
  deleteCategory,
  uploadImg,
  getGoods,
  getGoodsDetail,
  addGoods,
  editGoods,
  deleteGoods
}
