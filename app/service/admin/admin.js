'use strict';

const bcrypt = require('bcrypt');

const Service = require('egg').Service;

class AdminService extends Service {
  /**
   * 查询一个管理员
   * @param {string} email 邮箱
   * @return {object} 管理员信息
   */
  async findOne(email) {
    const user = await this.app.mysql.get('admin', { email });
    return user;
  }

  /**
   * 查询所有管理员
   * @return {object} 管理员列表
   */
  async findAll() {
    const results = await this.app.mysql.select('admin');
    return { results };
  }

  /**
   * 新增管理员
   * @param {object} info 管理员信息
   * @return {boolean} 是否成功
   */
  async add(info) {
    const { name, email, password, avatar, role } = info;
    const result = await this.app.mysql.insert('admin', {
      name, email, password, avatar, role,
    });
    return result.affectedRows === 1;
  }

  /**
   * 更新管理员信息
   * @param {object} info 管理员信息
   * @return {boolean} 是否成功
   */
  async update(info) {
    const { id, name, email, password, avatar, role, date } = info;
    const result = await this.app.mysql.update('admin', {
      id, name, email, password, avatar, role, date,
    });
    console.log(result);
    return result.affectedRows === 1;
  }

  /**
   * 删除一个管理员
   * @param {*} id 管理员id
   * @return {boolean} 是否成功
   * @memberof UserService
   */
  async delete(id) {
    const result = await this.app.mysql.delete('admin', { id });
    console.log(result);
    return result.affectedRows === 1;
  }


  /**
   * 比较管理员输入密码是否正确
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

module.exports = AdminService;
