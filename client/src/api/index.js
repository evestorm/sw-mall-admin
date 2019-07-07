import { request } from './request'

// const baseURL = process.env.NODE_ENV === 'production'
//   ? 'https://mall.evelance.cn/admin'
//   : 'http://localhost:7001/admin'

const POST = 'post'

// const postLogin = request(`${baseURL}/login`, POST)
const postLogin = request('/admin/login', POST) // 登录
const getUser = request('/admin/user') // 获取管理员信息
const getSiteInfo = request('/admin/siteinfo') // 获取首页信息
const getCategory = request('/admin/category') // 获取商品分类信息
const addCategory = request('/admin/category/add', POST) // 新增商品分类
const editCategory = function(ID) {
  return request(`/admin/category/edit/${ID}`, POST) // 更新商品分类
}
const deleteCategory = function(ID) {
  return request(`/admin/category/delete/${ID}`, POST) // 删除商品分类
}
const uploadImg = request('/admin/form/upload/', POST) // 上传图片
const getGoods = request('/admin/goods') // 获取商品列表
const getGoodsDetail = function(ID) {
  return request(`/admin/goods/detail/${ID}`) // 获取商品详情
}
const addGoods = request('/admin/goods/add', POST) // 新增商品
const editGoods = function (ID) {
  return request(`/admin/goods/edit/${ID}`, POST) // 更新商品
}
const deleteGoods = function (ID) {
  return request(`/admin/goods/delete/${ID}`, POST) // 删除商品
}

export {
  postLogin,
  getUser,
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
