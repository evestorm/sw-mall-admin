'use strict';

const Controller = require('egg').Controller;

class SiteController extends Controller {
  async getSiteInfo() {
    const { ctx } = this;
    // 周用户注册数
    const regUsers = await ctx.service.admin.site.getRegisteredUsers();
    // 周商品上新
    const newGoodsNum = await ctx.service.admin.site.getNewGoodsNum();
    // 商品销量前十
    const salesTop10 = await ctx.service.admin.site.getSalesOfTOP10();
    if (regUsers >= 0 && newGoodsNum >= 0) {
      ctx.status = 200;
      ctx.body = {
        code: 0,
        message: '成功获取首页数据',
        data: {
          regUsers,
          newGoodsNum,
          salesTop10,
        },
      };
    } else {
      ctx.status = 200;
      ctx.body = {
        code: 0,
        message: '获取首页数据失败',
        data: {},
      };
    }
  }
}

module.exports = SiteController;
