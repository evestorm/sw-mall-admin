'use strict';

const Controller = require('egg').Controller;

class IndexController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = '我是admin下的首页Index';
  }
}

module.exports = IndexController;
