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
   * 新增用户
   * @param {object} info 用户信息
   * @return {boolean} 是否成功
   */
  async add(info) {
    const { username, email, password, avatar } = info;
    const result = await this.app.mysql.insert('user', {
      username, email, password, avatar,
    });
    return result.affectedRows === 1;
  }

  /**
   * 更新用户信息
   * @param {object} info 用户信息
   * @return {boolean} 是否成功
   */
  async update(info) {
    const { id, username, email, password, avatar } = info;
    const result = await this.app.mysql.update('user', {
      id, username, email, password, avatar,
    });
    console.log(result);
    return result.affectedRows === 1;
  }

  /**
   * 删除一个用户
   * @param {*} id 用户id
   * @return {boolean} 是否成功
   */
  async delete(id) {
    const result = await this.app.mysql.delete('user', { id });
    console.log(result);
    return result.affectedRows === 1;
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
