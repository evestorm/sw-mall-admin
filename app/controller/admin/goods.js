'use strict';

const Controller = require('egg').Controller;

class GoodsController extends Controller {

  /**
   *  根据类别获取商品列表
   */
  async getGoodsList() {
    const { ctx } = this;
    // 把前端的查询参数交给service
    // 并获取「符合条件的所有条数」以及「当前请求页的具体15条数据」
    const { allCount, results } = await ctx.service.admin.goods.findAllByFilter(ctx.query);
    if (results) {
      ctx.status = 200;
      ctx.body = {
        code: 0,
        message: '成功获取商品列表',
        data: {
          allCount,
          results,
        },
      };
    } else {
      ctx.status = 400;
      ctx.body = {
        code: 1,
        message: '查询失败，请稍后重试！',
      };
    }
  }

  /**
   *  根据ID获取一个商品详情
   */
  async getGoodsDetail() {
    const { ctx } = this;
    const result = await ctx.service.admin.goods.findOne(ctx.params.ID);
    if (result) {
      ctx.status = 200;
      ctx.body = {
        code: 0,
        message: '成功获取商品数据',
        data: {
          result,
        },
      };
    } else {
      ctx.status = 400;
      ctx.body = {
        code: 1,
        message: '查询失败，请稍后重试！',
      };
    }
  }

  /**
   * 新增一个商品
   */
  async addGoods() {
    const { ctx } = this;
    ctx.body = ctx.request.body;
    const result = await ctx.service.admin.goods.add(ctx.body);
    if (result) {
      ctx.status = 200;
      ctx.body = {
        code: 0,
        message: '恭喜你，添加商品成功！',
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
   * 编辑一个商品
   */
  async editGoods() {
    const { ctx } = this;
    const ID = ctx.params.ID;
    ctx.body = ctx.request.body;
    const result = await ctx.service.admin.goods.findOne(ID);
    if (result) {
      await ctx.service.admin.goods.update(ctx.body).then(updated => {
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
        message: '没有查询到您要更新的商品',
      };
    }
  }

  /**
   * 删除一个商品
   */
  async deleteGoods() {
    const { ctx } = this;
    const ID = ctx.params.ID;
    const result = await ctx.service.admin.goods.delete(ID);
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
  // ================ 手机端商城 =================
  /**
   * 根据当前请求二级分类和页码返回商品列表
   */
  async getGoodsListByCategorySubID() {
    const { ctx } = this;
    // 子类别ID 当前请求的页数 每页显示数量 开始位置
    const { curSubCateId, page } = ctx.request.body;
    const num = 10;
    const start = (page - 1) * num;
    const filter = {
      SUB_ID: curSubCateId,
      page,
      num,
      start,
    };
    const result = await ctx.service.admin.goods.findGoodsByCategorySubID(filter);
    if (result) {
      ctx.status = 200;
      ctx.body = {
        code: 0,
        message: '数据请求成功！',
        data: result,
      };
    } else {
      ctx.status = 400;
      ctx.body = {
        code: 1,
        message: '数据请求失败',
      };
    }
  }

  /**
   * 根据当前请求二级分类和页码返回商品列表
   */
  async getGoodsListBySearch() {
    const { ctx } = this;
    // 子类别ID 当前请求的页数 每页显示数量 开始位置
    const result = await this.service.admin.goods.findGoodsListBySearch(ctx.request.body);
    console.log(result);
    if (result) {
      ctx.status = 200;
      ctx.body = {
        code: 0,
        message: '查询商品成功！',
        data: result,
      };
    } else {
      ctx.status = 400;
      ctx.body = {
        code: 1,
        message: '查询商品失败',
      };
    }
  }
}

module.exports = GoodsController;
