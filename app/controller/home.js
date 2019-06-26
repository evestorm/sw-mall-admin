'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = 'hi, egg';
  }

  async test() {
    const { ctx } = this;
    const category = await ctx.service.test.findAll();
    ctx.body = category;
  }
}

module.exports = HomeController;
