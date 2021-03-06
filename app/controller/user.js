'use strict';

const Controller = require('egg').Controller;
const bcrypt = require('bcrypt');
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');

class UserController extends Controller {

  /**
   *  登录
   */
  async login() {
    const { ctx } = this;
    const { email, password } = ctx.request.body;
    // 根据email查找该用户
    const user = await ctx.service.user.findOne(email);
    if (user) {
      const hashpwd = user.password;
      // 比对密码是否一致，一致生成 token 登录成功
      await ctx.service.user.comparePassword(password, hashpwd).then(isMatch => {
        if (isMatch) {
          const { id, username, avatar } = user;
          const rule = { id, email, username, avatar };
          // jwt.sign('规则', '加密名字', '过期时间')
          const token = jwt.sign(rule, 'lance', { expiresIn: '3600s' });
          ctx.body = {
            code: 0,
            message: 'success',
            data: {
              token: 'Bearer ' + token,
            },
          };
        } else {
          ctx.status = 400;
          ctx.body = {
            code: 1,
            message: '登录失败，请检查用户名或密码是否填写正确！',
          };
        }
      }).catch(err => {
        ctx.status = 500;
        ctx.body = {
          code: 1,
          message: err,
        };
      });
    } else {
      ctx.status = 404;
      ctx.body = {
        code: 1,
        message: '用户不存在！',
      };
    }
  }
  /**
   *  注册
   */
  async register() {
    const { ctx } = this;
    ctx.body = ctx.request.body;
    // 判断邮箱是否已经注册过
    const user = await ctx.service.user.findOne(ctx.body.email);
    if (user) {
      ctx.status = 400;
      ctx.body = {
        code: 1,
        message: '邮箱已被注册!',
      };
    } else {
      let { username, email, password } = ctx.body;
      // 加盐
      const salt = bcrypt.genSaltSync(10);
      // 生成hash密码
      const hash = bcrypt.hashSync(password, salt);
      password = hash;
      // 获取/生成全球头像（当该邮箱从未注册过，返回一个默认头像，否则返回用户头像）
      const avatar = gravatar.url(email, {
        s: '200', r: 'pg', d: 'mm',
      });
      const result = await ctx.service.user.add({
        username, email, password, avatar,
      });
      if (result) {
        const { user } = await ctx.service.user.findOne(email);
        ctx.status = 200;
        ctx.body = {
          code: 0,
          message: '恭喜你，注册成功！',
          data: user,
        };
      } else {
        ctx.status = 500;
        ctx.body = {
          code: 1,
          message: '注册失败，请稍后重试',
        };
      }
    }
  }

  /**
   * 更新个人信息
   */
  async updateUserInfo() {
    const { ctx } = this;
    ctx.body = ctx.request.body;
    const { email } = ctx.request.body;
    const result = await ctx.service.user.findOne(email);
    if (result) {
      await ctx.service.user.update(ctx.body).then(updated => {
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
        message: '没有查询到您要更新的用户',
      };
    }
  }


  /**
   * 获取用户信息
   */
  async user() {
    const { ctx } = this;
    // 使用 ctx.isAuthenticated() 判断是否登录。
    if (ctx.isAuthenticated()) {
      const { id, username, avatar, email } = ctx.user;
      ctx.status = 200;
      ctx.body = {
        code: 0,
        message: '获取信息成功！',
        data: { id, username, avatar, email },
      };
    }
  }
}

module.exports = UserController;
