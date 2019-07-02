'use strict';

const Controller = require('egg').Controller;

class CategoryController extends Controller {

  /**
   *  返回商品一级分类的数据
   */
  async getCategoryList() {
    const { ctx } = this;
    const categoryList = await ctx.service.admin.category.findAllCate();
    if (categoryList) {
      ctx.status = 200;
      ctx.body = {
        code: 0,
        message: '成功获取商品一级分类数据',
        data: categoryList,
      };
    }
  }

  /**
   * 新增一个一级商品分类
   */
  async addCategory() {
    const { ctx } = this;
    ctx.body = ctx.request.body;
    ctx.body.parent_id = 0;
    const result = await ctx.service.admin.category.add(ctx.body);
    if (result) {
      ctx.status = 200;
      ctx.body = {
        code: 0,
        message: '恭喜你，添加一级分类成功！',
      };
    } else {
      ctx.status = 200;
      ctx.body = {
        code: 1,
        message: '添加失败，请稍后重试',
      };
    }
  }

  /**
   * 编辑一个一级商品分类
   */
  async editCategory() {
    const { ctx } = this;
    const cate_id = ctx.params.cate_id;
    ctx.body = ctx.request.body;
    const result = await ctx.service.admin.category.findOneByCateId(cate_id);
    if (result) {
      await ctx.service.admin.category.update(ctx.body).then(updated => {
        if (updated) {
          ctx.status = 200;
          ctx.body = {
            code: 0,
            message: '更新成功！',
          };
        } else {
          ctx.status = 400;
          ctx.body = {
            code: 1,
            message: '更新失败！请稍后再试',
          };
        }
      });
    } else {
      ctx.status = 200;
      ctx.body = {
        code: 1,
        message: '没有查询到您要更新的分类',
      };
    }
  }

  /**
   * 删除一个分类
   */
  async deleteCategory() {
    const { ctx } = this;
    const cate_id = ctx.params.cate_id;
    const result = await ctx.service.admin.category.delete(cate_id);
    if (result) {
      ctx.status = 200;
      ctx.body = {
        code: 0,
        message: '删除成功！',
      };
    } else {
      ctx.status = 400;
      ctx.body = {
        code: 1,
        message: '删除失败！请稍后再试',
      };
    }
  }
}

module.exports = CategoryController;
