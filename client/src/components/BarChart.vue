<template>
  <div :class="className" :id="id" :style="{height:height, width:width}" ref="myEchart"></div>
</template>

<script>
export default {
  data() {
    return {
      chart: null,
      options: {
        title: {
          text: '销量前十',
          x: 'left',
          textStyle: {
            color: '#666'
          }
        },
        color: ['rgb(24, 144, 255)'],
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          data: [],
          axisTick: {
            alignWithLabel: true
          },
          axisLabel: {
            rotate: 30,
            interval: 0
          }
        }],
        yAxis: [{
          type: 'value',
          min: 'dataMin' // 最小值
        }],
        series: [{
          name: '销量',
          type: 'bar',
          barWidth: '60%',
          data: []
        }]
      }
    }
  },
  mounted() {
    this.initChart()
    this.getBarData()
  },
  beforeDestroy() {
    if (!this.chart) return
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    getBarData() {},
    initChart() {
      this.chart = this.$echarts.init(document.getElementById(this.id))
      // 把配置和数据放这里
      this.chart.setOption(this.options)
      // 自适应屏幕
      window.addEventListener('resize', () => {
        this.chart.resize()
      }, false)
    }
  },
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    id: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '300px'
    },
    height: {
      type: String,
      default: '300px'
    },
    top10: {
      type: Array
    }
  },
  watch: {
    top10(newValue) {
      this.options.xAxis[0].data = newValue.map(v => v.NAME)
      this.options.series[0].data = newValue.map(v => v.SALES_COUNT)
      this.chart.setOption(this.options)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
