'use strict';

/** @type Egg.EggPlugin */
module.exports = {
  mysql: {
    enable: true,
    package: 'egg-mysql',
  },
  passport: {
    enable: true,
    package: 'egg-passport',
  },
  passportJwt: {
    enable: true,
    package: 'passport-jwt',
  },
  cors: {
    enable: true,
    package: 'egg-cors',
  },
};
