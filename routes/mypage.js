const express = require('express');
const Community = require('../models/community');
const User = require('../models/user');
const Review = require('../models/review');
const Question = require('../models/question');
const Comment = require('../models/comment');
const Restaurant = require('../models/restaurant');

const router = express.Router();
const upload = require('../S3/s3');
const AWS = require('aws-sdk');
const s3 = new AWS.S3();
//multer-s3 미들웨어 연결
require('dotenv').config();
const authMiddleware = require('../middlewares/auth-middleware');

// 마이페이지
router.get('/myPage', async (req, res) => {
    const { user } = res.locals;
    const { userId } = user;

    try {
        const myPage = await User.find({ userId });
        res.status(200).json({ msg: '마이페이지 메인 success', myPage });
    } catch (err) {
        res.status(400).json({ msg: '마이페이지 메인 fail' });
    }
});

// 내가 찜한 식당
router.get('/myPage/myRestaurant', async (req, res, next) => {
    const { user } = res.locals;
    const { userId } = user;

    try {
        const myRestaurant = await User.find({ userId }, { myRestaurant });
        // 유저 스키마에 배열로 찜 레스토랑Id 저장
        for (let i = 0; i < myRestaurant.length; i++) {
            // 레스토랑리스트를 넘겨줄 수 있도록( 레스토랑이름, 이미지 만 넘겨주고 상세페이지로 가도록)
        }
        res.status(200).json({ msg: '찜한 식당 조회 success' });
    } catch (err) {
        res.status(400).json({ msg: '찜한 식당 조회 fail' });
    }
});

// 내가작성한 리뷰
router.get('/myPage/myReview', async (req, res, next) => {
    const { user } = res.locals;
    const { userId } = user;

    try {
        const userInfo = await User.findOne({
            userId,
        });
        var myReview = await Review.find({ userId });
        for (let i = 0; i < myReview.length; i++) {
            myReview[i]['nickName'] = `${userInfo.userNickname}`;
            myReview[i]['userImg'] = `${userInfo.userImg}`;
        }
        res.status(200).json({ msg: '내가 쓴 리뷰 success', myReview });
    } catch (err) {
        res.status(400).json({ msg: '내가 쓴 리뷰 fail' });
    }
});

// 내가 쓴 커뮤니티
router.get('/myPage/myCommunity', async (req, res) => {
    const { user } = res.locals;
    const { userId } = user;

    try {
        const userInfo = await User.findOne({
            userId,
        });
        var myCommunity = await Community.find({ userId });
        for (let i = 0; i < myCommunity.length; i++) {
            myCommunity[i]['nickName'] = `${userInfo.userNickname}`;
            myCommunity[i]['userImg'] = `${userInfo.userImg}`;
        }
        res.status(200).json({ msg: '내가 쓴 커뮤니티 success', myCommunity });
    } catch (err) {
        res.status(400).json({ msg: '내가 쓴 커뮤니티 fail' });
    }
});

// 프로필 수정
router.post('/myPage/myProfile/:address', async (req, res) => {
    const { address } = req.query;
    const { user } = res.locals;
    const { userId, userAddress } = user;

    const { userNickname, userEmail, userComment, userImg } = req.body;

    //특수문자 제한 정규식
    const regexr = /^[a-zA-Z0-9가-힣\s.~!,]{1,100}$/;
    const regexr1 = /^[a-zA-Z0-9가-힣]{1,8}$/;
    if (!regexr1.test(nickName)) {
        return res.status(403).send('특수문자를 사용할 수 없습니다');
    }

    if (userNickname.length > 0) {
        const alreadyUser = await User.find({ userNickname });
        if (alreadyUser.length > 0) {
            return res.status(403).send('현재 사용중인 닉네임 입니다');
        }
    }
    try {
        if (address !== userAddress) {
            await User.updateOne(
                { userId },
                {
                    $set: {
                        userNickname,
                        userEmail,
                        userComment,
                        userAddress,
                        userImg,
                    },
                }
            );
        } else {
            await User.updateOne(
                { userId },
                {
                    $set: {
                        userNickname,
                        userEmail,
                        userComment,
                        userImg,
                    },
                }
            );
        }
        res.status(200).send({
            msg: '프로필 수정 success',
        });
    } catch (err) {
        console.error(err);
        res.status(400).send({
            msg: '프로필 수정 fail',
        });
    }
});

// 자주묻는 질문
router.get('/mypage/popularQnA', async (req, res, next) => {
    const { user } = res.locals;
});

// 문의등록
router.post('/mypage/personalQna', async (req, res, next) => {
    const { user } = res.locals;
    const { userId } = user;
});
// 문의등록
router.post('/mypage/personalQna/:questionId', async (req, res, next) => {
    const { questionId } = req.params;
    const { user } = res.locals;
    const { userId } = user;
});

module.exports = router;
