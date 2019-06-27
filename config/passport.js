const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const User = mongoose.model('user');
const keys = require('./keys');

const options = {};
options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
options.secretOrKey = keys.secretOrKey;

module.exports = passport => {
    passport.use(new JwtStrategy(options,(jwt_payload, done) =>{
        User.findById(jwt_payload.id)
            .then(user => {
                if (user) {
                    console.log(user);
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            }

            )
        console.log(jwt_payload);
    } ));
};