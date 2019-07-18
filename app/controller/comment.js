'use strict';

const Controller = require('egg').Controller;

class CommentController extends Controller {

  /**
   * 根据商品ID返回评论列表
   */
  async getCommentsListByGoodsId() {
    const { ctx } = this;
    const { goodsId, page } = ctx.request.body;
    const num = 10;
    const start = (page - 1) * num;
    const result = await ctx.service.comment.findOneByGoodsId({ goodsId, start, num });

    if (result) {
      ctx.status = 200;
      ctx.body = {
        code: 0,
        message: '成功获取评论数据',
        data: result,
      };
    }
  }

  /**
   * 新增一条评论
   */
  async addComment() {
    const { ctx } = this;
    ctx.body = ctx.request.body;
    const result = await ctx.service.comment.add(ctx.body);
    if (result) {
      ctx.status = 200;
      ctx.body = {
        code: 0,
        message: '恭喜你，添加评论成功！',
      };
    } else {
      ctx.status = 200;
      ctx.body = {
        code: 1,
        message: '添加失败，请稍后重试',
      };
    }
  }
}

module.exports = CommentController;
