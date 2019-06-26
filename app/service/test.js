'use strict';

const Service = require('egg').Service;

class TestService extends Service {
  /**
   * 查询所有商品分类
   * @return {object} 分类列表
   */
  async findAll() {
    const results = await this.app.mysql.select('category');
    return { results };
  }
}

module.exports = TestService;
