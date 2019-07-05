'use strict';

const bcrypt = require('bcrypt');

const Service = require('egg').Service;

class UserService extends Service {
  /**
   * 查询一个用户
   * @param {string} email 邮箱
   * @return {object} 用户信息
   */
  async findOne(email) {
    const user = await this.app.mysql.get('user', { email });
    return user;
  }

  /**
   * 查询所有用户
   * @return {object} 用户列表
   */
  async findAll() {
    const results = await this.app.mysql.select('user');
    return { results };
  }

  /**
   * 比较用户输入密码是否正确
   * @param {string} pwd 管理员输入密码
   * @param {string} hashpwd hash后的密码
   * @return {boolean} 是否匹配
   */
  comparePassword(pwd, hashpwd) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(pwd, hashpwd, (err, isMatch) => {
        if (!err) resolve(isMatch);
        else reject(err);
      });
    });
  }
}

module.exports = UserService;
