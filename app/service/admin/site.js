'use strict';

const Service = require('egg').Service;

class SiteService extends Service {
  /**
   * 获取周用户注册数
   * @return {number} 注册数量
   */
  async getRegisteredUsers() {
    const results = await this.app.mysql.query('SELECT COUNT(*) AS RESULTS FROM user WHERE DATE_SUB(CURDATE(), INTERVAL 7 DAY) <= create_time');
    return results[0].RESULTS;
  }

  /**
   * 获取周商品上新数量
   */
  async getNewGoodsNum() {
    const results = await this.app.mysql.query('SELECT COUNT(*) AS RESULTS FROM goods WHERE DATE_SUB(CURDATE(), INTERVAL 7 DAY) <= CREATE_TIME');
    return results[0].RESULTS;
  }

  /**
   * 获取周商品上新数量
   */
  async getSalesOfTOP10() {
    const results = await this.app.mysql.select('goods', {
      columns: [ 'NAME', 'SALES_COUNT' ],
      orders: [[ 'SALES_COUNT', 'DESC' ]],
      limit: 10,
    });
    return results;
  }
}

module.exports = SiteService;
