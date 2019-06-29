'use strict';

const JwtStrategy = require('passport-jwt').Strategy,
  ExtractJwt = require('passport-jwt').ExtractJwt;

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'lance';

module.exports = app => {
  app.passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    app.mysql.get('admin', { id: jwt_payload.id }).then(user => {
      if (user) {
        console.log(user);
        return done(null, user);
      }
      return done(null, false);
    }).catch(err => console.log(err));
  }));
};
