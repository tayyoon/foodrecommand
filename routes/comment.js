const express = require('express');
const Community = require('../models/community');
const Review = require('../models/review');
const User = require('../models/user');
const Restaurant = require('../models/restaurant');
const router = express.Router();
const moment = require('moment');
const upload = require('../S3/s3');
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

module.exports = router;
