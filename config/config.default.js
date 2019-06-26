/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1561473658768_9757';

  // add your middleware config here
  config.middleware = [];

  // 配置数据库信息
  config.mysql = {
    client: {
      host: '127.0.0.1',
      port: '8889',
      user: 'root',
      password: 'root',
      database: 'sw-mall',
    },
    app: true,
    agent: false,
  };

  // 配置 passport-jwt
  config.passportJwt = {
    secret: 'lance',
  };

  // 开发阶段暂时关闭 csrf 防御
  config.security = {
    csrf: {
      enable: false,
    },
  };
  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
