import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from './api/http'
import './utils/getViewportSize'

// 按需引入 element-ui
import { Row, Button, Select, Form, FormItem, Input, Message, Loading, Container, Aside, Menu, Submenu, MenuItemGroup, MenuItem, Table, Main, TableColumn, Header, Col, DropdownItem, Dropdown, DropdownMenu, Avatar, Popover, Tag, Dialog, Upload, Image, MessageBox, Tooltip, Option, DatePicker, Pagination, Switch, Breadcrumb, BreadcrumbItem, Card } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(Row).use(Button).use(Select)
  .use(Form).use(FormItem).use(Input)
  .use(Loading).use(Container).use(Aside)
  .use(Menu).use(Submenu).use(MenuItemGroup)
  .use(MenuItem).use(Table).use(TableColumn)
  .use(Main).use(Header).use(Col)
  .use(DropdownItem).use(Dropdown).use(DropdownMenu)
  .use(Avatar).use(Popover).use(Tag).use(Dialog)
  .use(Upload).use(Image).use(Tooltip).use(Option)
  .use(DatePicker).use(Pagination).use(Switch)
  .use(Breadcrumb).use(BreadcrumbItem).use(Card)

// 按需引入 echartsjs
const echarts = require('echarts/lib/echarts')
// 引入柱状图等组件
require('echarts/lib/chart/bar')
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
require('echarts/lib/component/legend')
require('echarts/lib/component/legendScroll') // 图例滚动
Vue.prototype.$echarts = echarts

// 把 Message 单独拎出来是因为按照上面方式引入会导致每次页面刷新会自动弹出通知消息
Vue.component(Message.name, Message)
// 让组件中可以调用 this.$message
Vue.prototype.$message = Message
Vue.prototype.$msgbox = MessageBox

Vue.prototype.$axios = axios

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
