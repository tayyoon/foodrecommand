require('dotenv').config();

const passport = require('passport');
const {
    Strategy: NaverStrategy,
    Profile: NaverProfile,
} = require('passport-naver-v2');
const User = require('../models/user');

module.exports = () => {
    passport.use(
        new NaverStrategy(
            {
                // clientID: config.naver.clientID,
                // clientSecret: config.naver.clientSecret,
                // callbackURL: config.naver.callbackURL,
                clientID: process.env.NAVER_CLIENT_ID,
                clientSecret: process.env.NAVER_CLIENT_SECRET,
                callbackURL: process.env.NAVER_CALL_BACK_URL,
            },
            // function (accessToken, refreshToken, profile, done) {
            //     // User.findOne(
            //     //     {
            //     //         'naver.id': profile.id,
            //     //     },
            //         function (err, user) {
            //             if (!user) {
            //                 user = new User({
            //                     name: profile.displayName,
            //                     email: profile.emails[0].value,
            //                     username: profile.displayName,
            //                     provider: 'naver',
            //                     naver: profile._json,
            //                 });
            //                 user.save(function (err) {
            //                     if (err) console.log(err);
            //                     return done(err, user);
            //                 });
            //             } else {
            //                 return done(err, user);
            //             }
            //         }
            //     );
            // }
            async (accessToken, refreshToken, profile, done) => {
                console.log('naver profile : ', profile);
                try {
                    const exUser = await User.findOne({
                        // 카카오 플랫폼에서 로그인 했고 & snsId필드에 카카오 아이디가 일치할경우
                        userId: profile.id,
                    });
                    // 이미 가입된 카카오 프로필이면 성공
                    if (exUser) {
                        done(null, exUser); // 로그인 인증 완료
                    } else {
                        // 가입되지 않는 유저면 회원가입 시키고 로그인을 시킨다
                        const newUser = await User.create({
                            userId: profile.id,
                            nickname: profile.name,
                            email: profile.email,
                            provider: 'naver',
                            // naver: profile._json,
                        });
                        done(null, newUser); // 회원가입하고 로그인 인증 완료
                    }
                } catch (error) {
                    console.error(error);
                    done(error);
                }
            }
        )
    );
};
