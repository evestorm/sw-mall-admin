'use strict';

module.exports = app => {
  app.passport.verify(async (ctx, user) => {
    // 检查用户
    const existsUser = await app.mysql.get('admin', { id: user.payload.id });
    if (existsUser) return existsUser;
  });
};
