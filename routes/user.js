require('dotenv').config();
const express = require('express');
const User = require('../models/user');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middlewares/auth-middleware');
const upload = require('../S3/s3');
// const Joi = require('joi');
// const user_validation = require('../vaildation/user.val');

router.get('/kakao', passport.authenticate('kakao'));

const kakaoCallback = (req, res, next) => {
    passport.authenticate(
        'kakao',
        { failureRedirect: '/' },
        (err, user, info) => {
            if (err) return next(err);
            console.log('콜백~~~');
            const userInfo = user;
            const { userId } = user;
            const token = jwt.sign({ userId }, process.env.MY_KEY);

            result = {
                token,
                userInfo,
            };
            console.log('카카오 콜백 함수 결과', result);
            res.send({ user: result });
        }
    )(req, res, next);
};

router.get('/callback/kakao', kakaoCallback);

//* 구글로 로그인하기 라우터 ***********************
router.get(
    '/google',
    passport.authenticate('google', {
        scope: ['profile'],
        // access_Type: 'offline',
        // approval_Prompt: 'force',
    })
); // 프로파일과 이메일 정보를 받는다.
//? 위에서 구글 서버 로그인이 되면, 네이버 redirect url 설정에 따라 이쪽 라우터로 오게 된다. 인증 코드를 박게됨

const googleCallback = (req, res, next) => {
    passport.authenticate(
        'google',
        { failureRedirect: '/' },
        (err, user, info) => {
            if (err) return next(err);
            console.log('콜백~~~');
            const userInfo = user;
            const { userId } = user;
            const token = jwt.sign({ userId }, process.env.MY_KEY);

            result = {
                token,
                userInfo,
            };
            console.log('구글 콜백 함수 결과', result);
            res.send({ user: result });
        }
    )(req, res, next);
};

router.get('/callback/google', googleCallback);
// passport.authenticate('google', { failureRedirect: '/' }), //? 그리고 passport 로그인 전략에 의해 googleStrategy로 가서 구글계정 정보와 DB를 비교해서 회원가입시키거나 로그인 처리하게 한다.

//* 네이버로 로그인하기 라우터 ***********************
router.get('/naver', passport.authenticate('naver', { authType: 'reprompt' }));

const naverCallback = (req, res, next) => {
    passport.authenticate(
        'naver',
        { failureRedirect: '/' },
        (err, user, info) => {
            if (err) return next(err);
            console.log('콜백~~~');
            const userInfo = user;
            const { userId } = user;
            const token = jwt.sign({ userId }, process.env.MY_KEY);

            result = {
                token,
                userInfo,
            };
            console.log('네이버 콜백 함수 결과', result);
            res.send({ user: result });
        }
    )(req, res, next);
};
//? 위에서 네이버 서버 로그인이 되면, 네이버 redirect url 설정에 따라 이쪽 라우터로 오게 된다.
// router.get(
//     '/naver/callback',
//     //? 그리고 passport 로그인 전략에 의해 naverStrategy로 가서 카카오계정 정보와 DB를 비교해서 회원가입시키거나 로그인 처리하게 한다.
//     passport.authenticate('naver', { failureRedirect: '/' }),
//     (req, res) => {
//         res.redirect('/');
//     }
// );

router.get('/callback/naver', naverCallback);

//회원가입

router.post(
    '/signUp',
    authMiddleware,
    user_validation.user_signUp,
    async (req, res) => {
        try {
            const { userNickName, userAge, userGender, userContent } = req.body;

            const { user } = res.locals;
            let userId = user.userId;
            //userId가 db에 존재하지않을 때 회원가입실패 메시지 송출
            const existUsers = await User.find({
                $or: [{ userId }],
            });
            if (!existUsers) {
                res.status(401).send('회원가입실패2');
            }
            await User.updateOne(
                { userId: userId },
                {
                    $set: {
                        userAge,
                        userNickName,
                        userGender,
                        userContent,
                    },
                }
            );
            res.status(201).send({
                message: '가입완료',
            });
        } catch (err) {
            console.log(err);
            res.status(400).send({
                errorMessage: '요청한 데이터 형식이 올바르지 않습니다.',
            });
        }
    }
);

//회원가입 api에서 이미지 업로드부분 빼내기
router.post(
    '/signUpImg',
    upload.single('userImg'),
    authMiddleware,
    async (req, res) => {
        try {
            const { user } = res.locals;
            let userId = user.userId;
            let userImg = req.file?.location;
            //userId가 db에 존재하지않을 때 회원가입실패 메시지 송출
            const existUsers = await User.find({
                $or: [{ userId }],
            });
            if (!existUsers) {
                res.status(401).send('회원가입실패');
            }

            await User.updateOne(
                { userId: userId },
                {
                    $set: {
                        userImg,
                    },
                }
            );

            res.status(201).send({
                userImg,
                message: '가입완료',
            });
        } catch (err) {
            console.log(err);
            res.status(400).send({
                errorMessage: '요청한 데이터 형식이 올바르지 않습니다.',
            });
        }
    }
);

module.exports = router;
