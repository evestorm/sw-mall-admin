'use strict';

const Service = require('egg').Service;

class CategoryService extends Service {
  /**
   * 查询一个商品分类
   * @param {string} cate_id 分类cate_id字段
   * @return {object} 分类信息
   */
  async findOneByCateId(cate_id) {
    const result = await this.app.mysql.get('category', { cate_id });
    return result;
  }

  /**
   * 查询所有商品分类
   * @return {object} 所有一级分类信息
   */
  async findAllCate() {
    const results = await this.app.mysql.select('category');
    return results;
  }

  /**
   * 新增一个分类
   * @param {object} info 分类信息
   * @return {boolean} 是否成功
   */
  async add(info) {
    // 生成随机32位「数字+字母」字符串
    const cate_id = this.ctx.helper.getRandomStr(32);
    const result = await this.app.mysql.insert('category', {
      cate_id, ...info,
    });
    return result.affectedRows === 1;
  }

  /**
   * 更新一个分类
   * @param {object} info 分类信息
   * @return {boolean} 是否成功
   */
  async update(info) {
    console.log(info);
    const options = {
      where: { cate_id: info.cate_id },
    };
    const result = await this.app.mysql.update('category', info, options);
    console.log(result);
    return result.affectedRows === 1;
  }

  /**
   * 删除一个分类
   * @param {*} cate_id 分类id
   * @return {boolean} 是否成功
   */
  async delete(cate_id) {
    const result = await this.app.mysql.delete('category', { cate_id });
    console.log(result);
    return result.affectedRows === 1;
  }

  /* ======================================== */

  // /**
  //  * 查询一个二级商品分类
  //  * @param {string} ID 分类ID
  //  * @return {object} 管理员信息
  //  */
  // async subFindOne(ID) {
  //   const user = await this.app.mysql.get('category_sub', { ID });
  //   return user;
  // }
}

module.exports = CategoryService;
