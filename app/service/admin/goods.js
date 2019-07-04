'use strict';

const Service = require('egg').Service;

class GoodsService extends Service {
  /**
   * 查询一条商品详情
   * @param {string} ID 商品ID
   * @return {object} 商品信息
   */
  async findOne(ID) {
    const goods = await this.app.mysql.get('goods', { ID });
    return goods;
  }

  /**
   * 查询符合条件的商品
   * @param {object} filter 前端传过来的参数
   * @return {object} 商品列表
   */
  async findAllByFilter(filter) {
    // 子分类ID，请求页，标题关键词，创建时间
    const { SUB_ID, page = 1, keywords = '', stime = '', etime = '' } = filter;
    // keywords = keywords);
    const start = (page - 1) * 15;

    let where = '';
    where += `WHERE SUB_ID = '${SUB_ID}'`;
    where += keywords !== '' ?
      ` AND NAME LIKE '%${keywords}%'` : '';
    where += stime !== '' && etime !== '' ?
      ` AND CREATE_TIME BETWEEN '${stime}' AND '${etime}'` : '';

    console.log(where);

    // 查询符合条件的总条数
    const allCount = await this.app.mysql.query(`SELECT COUNT(*) AS allCount FROM goods ${where}`);
    // 查询符合条件的15条
    const results = await this.app.mysql.query(
      `SELECT
        ID, SUB_ID, STATE, NAME, ORI_PRICE, PRESENT_PRICE, 
        AMOUNT, DETAIL, SALES_COUNT, IMAGE1, 
        IS_RECOMMEND, 
        CREATE_TIME, UPDATE_TIME 
      FROM goods ${where} LIMIT ${start}, 15`);
    return {
      allCount: allCount[0].allCount,
      results,
    };
  }

  /**
   * 新增一个商品
   * @param {object} info 商品信息
   * @return {boolean} 是否成功
   */
  async add(info) {
    // TODO: 测验直接写 info 会不会报错
    // 生成随机32位「数字+字母」字符串
    const ID = this.ctx.helper.getRandomStr(32);
    info.ID = ID;
    // const { SUB_ID, STATE, NAME, ORI_PRICE, PRESENT_PRICE, AMOUNT, DETAIL, SALES_COUNT, IMAGE1, CREATE_TIME, UPDATE_TIME, IS_RECOMMEND } = info;
    const result = await this.app.mysql.insert('goods', info);
    return result.affectedRows === 1;
  }

  /**
   * 更新一个商品
   * @param {object} info 一级分类信息
   * @return {boolean} 是否成功
   */
  async update(info) {
    console.log(info);
    const { ID } = info;
    const options = {
      where: { ID },
    };
    const result = await this.app.mysql.update('goods', info, options);
    console.log(result);
    return result.affectedRows === 1;
  }

  /**
   * 删除一个商品
   * @param {*} ID 商品ID
   * @return {boolean} 是否成功
   * @memberof UserService
   */
  async delete(ID) {
    const result = await this.app.mysql.delete('goods', { ID });
    console.log(result);
    return result.affectedRows === 1;
  }
}

module.exports = GoodsService;
