const express = require('express');
const Community = require('../models/community');
const User = require('../models/user');
const Review = require('../models/review');
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
router.get('/myPage', authMiddleware, async (req, res) => {
    const { user } = res.locals;
    const { userId } = user;

    try {
        const myPage = await User.find({ userId });
        res.status(200).json({ myPage });
    } catch (err) {
        console.log('마이페이지 에이피아이', err);
        res.status(400).json({ msg: 'mypage error' });
    }
});

// 내가 찜한 식당
router.get('/myPage/myRestaurant', authMiddleware, async (req, res, next) => {
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
router.get('/myPage/myReview', authMiddleware, async (req, res, next) => {
    const { user } = res.locals;
    const { userId } = user;

    try {
        //후기 작성이 안된 게시글만 불러오기
        const myReview = await Myex.find({ userId });
        for (let i = 0; i < myReview.length; i++) {
            // 마이 리뷰에 맞는 코멘트 같이 넘길 수 있도록 찾아야함
        }
        res.status(200).json({ myEx });
    } catch (err) {
        console.log('마이페이지 에이피아이2', err);
        res.status(400).json({ msg: 'myExercise error' });
    }
});

// 내가 쓴 글
router.get('/myPage/myCommunity', authMiddleware, async (req, res) => {
    const { user } = res.locals;
    const { userId } = user;

    try {
        const userInfo = await User.findOne({
            userId,
        });
        var myPost = await Post.find({ userId });
        for (let i = 0; i < myPost.length; i++) {
            myPost[i]['nickName'] = `${userInfo.nickName}`;
            myPost[i]['userAge'] = `${userInfo.userAge}`;
            myPost[i]['userGender'] = `${userInfo.userGender}`;
            myPost[i]['userImg'] = `${userInfo.userImg}`;
        }
        res.status(200).json({ myPost });
    } catch (err) {
        console.log('마이페이지 에이피아이3', err);
        res.status(400).json({ msg: 'mypage post error' });
    }
});

// 프로필 수정
router.post('/myPage/myProfile', authMiddleware, async (req, res) => {
    const { user } = res.locals;
    const userId = user.userId;

    const { userNickname, userEmail, userComment, userAddress, userImg } =
        req.body;

    //특수문자 제한 정규식
    const regexr = /^[a-zA-Z0-9가-힣\s.~!,]{1,100}$/;
    const regexr1 = /^[a-zA-Z0-9가-힣]{1,8}$/;
    if (!regexr1.test(nickName)) {
        return res.status(403).send('특수문자를 사용할 수 없습니다');
    }
    if (!regexr.test(userContent)) {
        return res.status(403).send('특수문자를 사용할 수 없습니다');
    }
    try {
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

module.exports = router;
