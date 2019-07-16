'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  // 商城首页数据
  async index() {
    // TODO: goods表中的GOOD_TYPE：0 普通 1首页不规则矩形推荐 2热门
    const { ctx } = this;
    // 广告和banner（isBanner为1是banner板块的广告）
    const adverts = await ctx.service.adverts.findAll();
    const adv = adverts.filter(v => v.isBanner === 0).map(v => {
      return {
        image: v.image,
        link: v.link,
      };
    });
    const banner = adverts.filter(v => v.isBanner === 1).map(v => {
      return {
        image: v.image,
        goodsId: v.link,
      };
    });
    // 休闲零食（GOOD_TYPE=1）
    const floor1 = await ctx.service.admin.goods.findGoodsByCategoryID(5);
    // 新鲜水果（GOOD_TYPE=1）
    const floor2 = await ctx.service.admin.goods.findGoodsByCategoryID(1);
    // 营养奶品（GOOD_TYPE=1）
    const floor3 = await ctx.service.admin.goods.findGoodsByCategoryID(3);
    // 推荐（IS_RECOMMEND=1）
    const recommend = await ctx.service.admin.goods.findRecommendGoods();
    // 热门（GOOD_TYPE=2）
    const hotGoods = await ctx.service.admin.goods.findHotGoods();
    if (adverts) {
      ctx.body = {
        code: 0,
        message: '成功获取广告数据',
        data: {
          adverts: adv,
          floor1,
          floor2,
          floor3,
          floorName: {
            floor1: '休闲零食',
            floor2: '新鲜水果',
            floor3: '营养奶品',
          },
          slides: banner,
          hotGoods,
          recommend,
        },
      };
    } else {
      ctx.status = 500;
      ctx.body = {
        code: 1,
        message: '查询失败，请稍后重试',
      };
    }
  }
  // 测试用
  async test() {
    const { ctx } = this;
    const category = await ctx.service.test.findAll();
    ctx.body = category;
  }
}

module.exports = HomeController;
