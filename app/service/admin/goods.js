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
    const arr = [];

    where += 'WHERE SUB_ID = ?';
    arr.push(SUB_ID);
    if (keywords !== '') {
      where += " AND NAME LIKE CONCAT('%', ?, '%')";
      arr.push(keywords);
    }
    if (stime !== '' && etime !== '') {
      where += ' AND CREATE_TIME BETWEEN ? AND ?';
      arr.push(stime, etime);
    }
    console.log(where);

    // 查询符合条件的总条数
    const allCount = await this.app.mysql.query(`SELECT COUNT(*) AS allCount FROM goods ${where}`, arr);
    // 查询符合条件的15条
    const results = await this.app.mysql.query(
      `SELECT
        ID, SUB_ID, STATE, NAME, ORI_PRICE, PRESENT_PRICE, 
        AMOUNT, DETAIL, SALES_COUNT, IMAGE1, 
        IS_RECOMMEND, 
        CREATE_TIME, UPDATE_TIME 
      FROM goods ${where} LIMIT ${start}, 15`, arr);
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

  // ================手机商城特有===================
  /**
   * 根据一级分类查找符合条件的商品给首页不规则矩形部分
   * @param {number} id 一级分类
   * @return {array} 商品数组
   * @memberof GoodsService
   */
  async findGoodsByCategoryID(id) {
    // 查询条件：一级分类id，推荐产品，商品类型为1
    // 先查符合条件的所有二级分类
    const subCateIDs = await this.app.mysql.select('category', {
      where: {
        parent_id: id,
      },
    });
    const ids = subCateIDs.map(v => v.cate_id);
    // 根据二级分类查找符合条件商品
    const goodsList = await this.app.mysql.select('goods', {
      where: {
        SUB_ID: ids,
        GOOD_TYPE: 1,
      },
      orders: [[ 'CREATE_TIME', 'asc' ]],
    });
    return goodsList.map(v => {
      return {
        goodsId: v.ID,
        image: v.IMAGE5,
      };
    });
  }

  /**
   * 热门商品
   * @return {array} 商品数组
   */
  async findHotGoods() {
    // 根据二级分类查找符合条件商品
    const goodsList = await this.app.mysql.select('goods', {
      where: { GOOD_TYPE: 2 },
    });
    return goodsList.map(v => {
      return {
        mallPrice: v.ORI_PRICE,
        image: v.IMAGE1,
        goodsId: v.ID,
        price: v.PRESENT_PRICE,
        name: v.NAME,
      };
    });
  }

  /**
   * 推荐商品
   * @return {array} 商品数组
   */
  async findRecommendGoods() {
    // 根据二级分类查找符合条件商品
    const goodsList = await this.app.mysql.select('goods', {
      where: { IS_RECOMMEND: 1 },
    });
    return goodsList.map(v => {
      return {
        mallPrice: v.ORI_PRICE,
        image: v.IMAGE1,
        goodsId: v.ID,
        price: v.PRESENT_PRICE,
        name: v.NAME,
      };
    });
  }

  /**
   * 查询当前二级分类下特定页码的商品列表
   * @param {*} filter 查询条件
   * @return {array} 商品数组
   */
  async findGoodsByCategorySubID(filter) {
    const { SUB_ID, start, num } = filter;
    const goodsList = await this.app.mysql.select('goods', {
      where: { SUB_ID },
      limit: num,
      offset: start,
    });
    // TODO:不要给这么多数据，前端需要什么给什么字段
    return goodsList;
  }
}

module.exports = GoodsService;
