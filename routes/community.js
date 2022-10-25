const express = require('express');
const User = require('../models/user');
const Community = require('../models/community');
const Comment = require('../models/comment');

const router = express.Router();
const moment = require('moment');
// const authMiddleware = require('../middlewares/auth-middleware')
// const upload = require('../S3/s3');
// const Joi = require('joi');
// const post_validation = require('../vaildation/post.val')

// 전체 커뮤니티 리스트
router.get('/communityList', async (req, res) => {
    try {
        let wholeCommunity = await Community.find({}).sort({ $natural: -1 });

        res.status(200).json({
            wholeCommunity,
            msg: '전체 커뮤니티 리스트 success',
        });
    } catch (error) {
        console.log(error);
        res.status(400).send('전체 커뮤니티 리스트 fail');
    }
});

// 상세페이지 조회
router.get(
    '/communityDetail/:communityId',

    async (req, res) => {
        const { communityId } = req.params;

        try {
            var thisCommnity = await Community.findOne({ _id: communityId });
            var comments = await Comment.find({
                postId: communityId,
            });

            res.status(200).json({
                thisCommnity,
                comments,
                msg: '커뮤니티 상세페이지 success',
            });
        } catch (error) {
            console.error(error);
            res.status(401).send({ msg: '커뮤니티 상세페이지 fail' });
        }
    }
);

//게시글 작성
router.post(
    '/communityWrite',
    // post_validation.post_wirte, (vaildation 예외처리시 활성화)
    async (req, res) => {
        //작성한 정보 가져옴
        const { communityTitle, communityDesc, communityImg } = req.body;

        // 사용자 브라우저에서 보낸 쿠키를 인증미들웨어통해 user변수 생성, 구조분해할당으로 인식이 되지않아 구조분해할당 해제
        const { user } = res.locals;
        const usersId = user.userId;
        const userNickname = user.userNickname;

        // 글작성시각 생성
        require('moment-timezone');
        moment.tz.setDefault('Asia/Seoul');
        const createdAt = String(moment().format('YYYY-MM-DD HH:mm:ss'));

        try {
            var communityList = await Community.create({
                userId: usersId,
                userNickname,
                communityTitle,
                communityDesc,
                communityImg,
                createAt: createdAt,
            });
            const userInfo = await User.findOne({
                userId: usersId,
            });

            res.status(200).json({
                msg: '커뮤니티 등록 success',
                communityList,
            });
        } catch (error) {
            console.log(error);

            res.status(400).send({ msg: '커뮤니티 등록 fail' });
        }
    }
);

// 게시글 삭제
router.delete(
    '/communityDelete/:communityId',

    async (req, res) => {
        const { communityId } = req.params;

        try {
            await Community.deleteOne({ communityId });
            await Comment.deleteOne({ communityId });
            res.status(200).send({ result: '커뮤니티 삭제 success' });
        } catch (error) {
            console.error(error);
            res.status(400).send({ msg: '커뮤니티 삭제 fail' });
        }
    }
);

module.exports = router;
