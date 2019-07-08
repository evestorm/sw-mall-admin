<template>
  <div class="dashboard">
    <el-row :gutter="10">
      <el-col v-for="(item, index) in topList" :key="index" :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
        <el-card class="box-card">
          <div class="item-left">
            <i :class="item.icon" :style="`color: ${item.color}`"></i>
          </div>
          <div class="item-right">
            <h2 class="title">{{item.name}}</h2>
            <div class="number">{{item.num}}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <el-card class="box-card" shadow="never">
          <bar-chart
            class="home-bar" id="home-bar"
            height="500px" width="100%" :top10="top10"></bar-chart>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import BarChart from '../components/BarChart'
import { getSiteInfo } from '../api/index'
export default {
  data() {
    return {
      topList: [
        { icon: 'el-icon-s-home', key: 'pv', name: '总访问量', num: 0, color: '#40c9c6' },
        { icon: 'el-icon-user-solid', key: 'regUsers', name: '周注册用户', num: 0, color: '#36a3f7' },
        { icon: 'el-icon-s-shop', key: 'newGoodsNum', name: '周商品上新', num: 0, color: '#f4516c' }
      ], // 顶部四栏数据
      top10: [] // 商品销量前十
    }
  },
  mounted() {
    this._getSiteInfo()
  },
  methods: {
    _getSiteInfo() {
      getSiteInfo().then(data => {
        this.topList.map(v => {
          if (data[v.key]) {
            v.num = data[v.key]
          }
        })
        this.top10 = data.salesTop10
      })
    }
  },
  components: {
    BarChart
  }
}
</script>

<style lang="stylus">
.dashboard
  padding 20px
  .el-row
    margin-bottom 20px
    &:last-child
      margin-bottom 0
    .el-col
      border-radius 4px
      margin-bottom 20px
      .box-card
        .el-card__body
          display flex
          justify-content space-around
          .item-left
            flex 1
            text-align left
            font-size 50px
            line-height 50px
          .item-right
            flex 1
            text-align right
            display flex
            flex-direction column
            justify-content space-around
            .title
              color rgba(0,0,0,.45)
              font-weight 700
            .number
              color #666
              font-size 20px
              font-weight 700
@media screen and (max-width 500px)
  .item-left
    display none
</style>
