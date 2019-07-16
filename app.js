'use strict';

const JwtStrategy = require('passport-jwt').Strategy,
  ExtractJwt = require('passport-jwt').ExtractJwt;

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'lance';

module.exports = app => {
  app.on('request', ctx => {
    app.passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
      // 鉴权后台管理系统
      if (ctx.request.url.indexOf('/admin') > -1) {
        app.mysql.get('admin', { id: jwt_payload.id }).then(user => {
          if (user) {
            return done(null, user);
          }
          return done(null, false);
        }).catch(err => console.log(err));
      } else { // 鉴权前台商城App
        app.mysql.get('user', { id: jwt_payload.id }).then(user => {
          if (user) {
            return done(null, user);
          }
          return done(null, false);
        }).catch(err => console.log(err));
      }
    }));
  });
};
