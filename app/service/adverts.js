'use strict';

const Service = require('egg').Service;

class AdvertsService extends Service {
  /**
   * 查询广告和banner轮播图推荐（isBanner为1表示banner）
   * @return {object} 分类信息
   */
  async findAll() {
    const result = await this.app.mysql.select('adverts');
    return result;
  }
}

module.exports = AdvertsService;
