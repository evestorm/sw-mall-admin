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
      dateString: true,
    },
    app: true,
    agent: false,
  };

  // 配置跨域（如果把项目放服务器得把127.0.0.1换成你的域名，端口号一般需要换成默认的80）
  config.cors = {
    origin: 'http://127.0.0.1:8080',
    credentials: true,
  };

  // 配置公共访问目录
  // config.static = {
  //   prefix: '/public/',
  //   dir: [ path.join(appInfo.baseDir, 'app/public') ],
  // };

  // 上传文件配置
  config.multipart = {
    fileSize: '1mb',
    mode: 'stream',
    fileExtensions: [
      '.jpg', '.jpeg', // image/jpeg
      '.png',
    ],
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
