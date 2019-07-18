'use strict';

const Service = require('egg').Service;

class CommentService extends Service {
  /**
   * 查询某商品的评论
   * @param {object} filter 查询条件
   * @return {array} 评论列表
   */
  async findOneByGoodsId(filter) {
    // 商品id，从哪儿开始，查几条
    const { goodsId, start, num } = filter;
    // 顶级评论查询
    const sql = `SELECT comments.*, username, avatar FROM comments LEFT JOIN user ON comments.uid = user.id WHERE comments.goodsId = '${goodsId}' AND pid=0 ORDER BY ctime DESC LIMIT ${start}, ${num}`;
    console.log(sql);
    const result = await this.app.mysql.query(sql);
    // 循环每个顶级评论，查找二级评论
    for (const top of result) {
      // let subComments = await db.QUERY_All(`SELECT comments.*, username, avatar FROM comments LEFT JOIN user ON comments.uid = user.id WHERE comments.goodsId = '${goodsId}' AND pid = ${top.cid} ORDER BY ctime ASC`);
      const subComments = await this.app.mysql.query(`
                SELECT 
                    a.*, 
                    user.username AS reviewer_username, 
                    user.avatar AS reviewer_avatar
                FROM
                    (SELECT comments.*, username, avatar FROM comments LEFT JOIN user ON comments.uid = user.id WHERE comments.goodsId = '${goodsId}' AND pid = ${top.cid} ORDER BY ctime ASC)
                    AS a
                LEFT JOIN user ON a.reviewerId = user.id`);
      if (subComments.length > 0) {
        top.reply = subComments;
      }
    }
    return result;
  }

  /**
   * 新增一条评论
   * @param {object} info 评论信息
   * @return {boolean} 是否成功
   */
  async add(info) {
    const result = await this.app.mysql.insert('comments', info);
    return result.affectedRows === 1;
  }
}

module.exports = CommentService;
