require('dotenv').config();

const passport = require('passport');
const google = require('./google');
const kakao = require('./kakao');

module.exports = () => {
    passport.serializeUser((user, done) => {
        // req.login(user, ...)의 user가 일로 와서 값을 이용할수 있는 것이다.
        console.log('직렬화!!!!!!', user[0].userId);
        done(null, user.userId);
    });
    passport.deserializeUser((user, done) => {
        // req.session에 저장된 사용자 아이디를 바탕으로 DB 조회로 사용자 정보를 얻어낸 후 req.user에 저장.
        // 즉, id를 sql로 조회해서 전체 정보를 가져오는 복구 로직이다.
        console.log('역직렬화!!!!!!!!!', user);
        done(null, user);
    });

    google();
    kakao();
};
