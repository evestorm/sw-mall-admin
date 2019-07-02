'use strict';

// 外部可以通过 this.ctx.helper.getRandomStr() 调用
// 模板中通过 helper.getRandomStr() 调用
module.exports = {
  getRandomStr(len) {
    let str = '';
    for (let i = 0; i < len; i++) {
      str += Math.random().toString(36).substring(2);
    }
    return str.substring(0, len);
  },
};
