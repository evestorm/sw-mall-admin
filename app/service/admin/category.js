'use strict';

const Service = require('egg').Service;

class CategoryService extends Service {
  /**
   * 查询一个一级商品分类
   * @param {string} ID 分类ID
   * @return {object} 管理员信息
   */
  async findOne(ID) {
    const user = await this.app.mysql.get('category', { ID });
    return user;
  }

  /**
   * 查询商品一级分类
   * @return {object} 一级分类列表
   */
  async findAll() {
    const results = await this.app.mysql.select('category');
    return results;
  }

  /**
   * 新增一个一级分类
   * @param {object} info 分类信息
   * @return {boolean} 是否成功
   */
  async add(info) {
    const { MALL_CATEGORY_NAME, IMAGE, SORT } = info;
    const result = await this.app.mysql.insert('category', {
      MALL_CATEGORY_NAME, IMAGE, TYPE: 2, SORT, COMMENTS: null,
    });
    return result.affectedRows === 1;
  }

  /**
   * 更新一个一级分类
   * @param {object} info 一级分类信息
   * @return {boolean} 是否成功
   */
  async update(info) {
    console.log(info);
    const { ID, MALL_CATEGORY_NAME, IMAGE, TYPE, SORT, COMMENTS } = info;
    const row = {
      MALL_CATEGORY_NAME, IMAGE, TYPE, SORT, COMMENTS,
    };
    const options = {
      where: { ID },
    };
    const result = await this.app.mysql.update('category', row, options);
    console.log(result);
    return result.affectedRows === 1;
  }

  /**
   * 删除一个一级分类
   * @param {*} ID 一级分类id
   * @return {boolean} 是否成功
   * @memberof UserService
   */
  async delete(ID) {
    const result = await this.app.mysql.delete('category', { ID });
    console.log(result);
    return result.affectedRows === 1;
  }
}

module.exports = CategoryService;
