const express = require('express');
const Community = require('../models/community');
const Comment = require('../models/comment');
const User = require('../models/user');
const Restaurant = require('../models/restaurant');
const router = express.Router();
const moment = require('moment');
// const authMiddleware = require('../middlewares/auth-middleware');

// 리뷰 등록 (커뮤니티 코멘트)
router.post('/community/comment/:postId', authMiddleware, async (req, res) => {
    try {
        const { postId } = req.params;
        const community = await Community.findOne({ _id: postId });
        const { user } = res.locals;
        const { userId } = user;
        const { comment } = req.body;

        require('moment-timezone');
        moment.tz.setDefault('Asia/Seoul');
        const createAt = String(moment().format('YYYY-MM-DD HH:mm:ss'));

        var commentList = await Review.create({
            postId,
            userId,
            nickName: 'a',
            userImg: 'a',
            comment,
            createAt,
        });
        const userInfo = await User.findOne({
            userId,
        });
        commentList['nickName'] = `${userInfo.nickName}`;
        commentList['userImg'] = `${userInfo.userImg}`;

        res.status(200).json({
            msg: '커뮤니티 코멘트 등록 success',
            commentList,
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({ msg: '커뮤니티 코멘트 등록 fail' });
    }
});

// 리뷰 등록 (레스토랑 코멘트)
router.post('/restaurant/comment/:postId', authMiddleware, async (req, res) => {
    try {
        const { postId } = req.params;
        const restaurant = await Restaurant.findOne({ _id: postId });
        const { user } = res.locals;
        const { userId } = user;
        const { restaurantImg, restaurantName } = restaurant;
        const { comment } = req.body;

        require('moment-timezone');
        moment.tz.setDefault('Asia/Seoul');
        const createAt = String(moment().format('YYYY-MM-DD HH:mm:ss'));

        var commentList = await Comment.create({
            postId,
            userId,
            nickName: 'a',
            userImg: 'a',
            userAge: 'a',
            comment,
            createAt,
        });
        const userInfo = await User.findOne({
            userId,
        });
        commentList['nickName'] = `${userInfo.nickName}`;
        commentList['userAge'] = `${userInfo.userAge}`;
        commentList['userImg'] = `${userInfo.userImg}`;

        res.status(200).json({
            msg: '레스토랑 코멘트 등록 success',
            commentList,
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({ msg: '레스토랑 코멘트 등록 fail' });
    }
});

// 코멘트 조회 -> 필요한가? 상세 페이지 조회에서 레스토랑, 커뮤니티 별 같이 코멘트도 각ID로 찾아서 보내주면 되겠지?

// 코멘트 삭제
router.delete('/comment/:commentId', authMiddleware, async (req, res) => {
    const { commentId } = req.params;
    const comment = await Comment.find({ _id: commentId });

    try {
        await Comment.deleteOne({ _id: commentId });

        res.send({ msg: '코멘트 삭제 success' });
    } catch {
        res.status(400).send({ msg: '코멘트 삭제 fail' });
    }
});

module.exports = router;
