import Vue from 'vue'
/**
 * 获取屏幕宽高
 */
Vue.prototype.getViewportSize = function () {
  return {
    width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
    height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
  }
}
