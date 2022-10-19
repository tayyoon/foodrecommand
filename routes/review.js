const express = require('express');
const User = require('../models/user');
const Community = require('../models/Community');
const Review = require('../models/review');
const Restaurant = require('../models/restaurant');

const router = express.Router();
// const moment = require('moment');
// const upload = require('../S3/s3');
// const authMiddleware = require('../middlewares/auth-middleware');

// 리뷰 등록
router.post('/review/:restaurnatId', authMiddleware, async (req, res) => {
    try {
        const { restaurnatId } = req.params;
        const restaurant = await Restaurant.findOne({ _id: restaurnatId });
        const { user } = res.locals;
        const { userId, userNickname } = user;
        const { restaurantName, restaurantPhone, restaurantAdress } =
            restaurant;
        const { reviewTitle, reviewDesc, reviewScore, reviewImg, reviewTag } =
            req.body;

        require('moment-timezone');
        moment.tz.setDefault('Asia/Seoul');
        const createdAt = String(moment().format('YYYY-MM-DD HH:mm:ss'));

        // 레스토랑Id로 DB에 검색해서 모든 socre값의 합 으로 평균내서 restaurantDB에 리뷰 작성할때마다 수정되도록
        // await Restaurant.updateOne(
        //     { restaurantId },
        //     {
        //         $set: {
        //             restaurantScore: selfEvalue,
        //             level,
        //         },
        //     }
        // );

        var reviewList = await Review.create({
            reviewTitle,
            reviewDesc,
            reviewScore,
            reviewImg,
            reviewTag,
            userId,
            nickName: 'a',
            userImg: 'a',
            createAt: createdAt,
        });
        const userInfo = await User.findOne({
            userId,
        });

        reviewList['nickName'] = `${userInfo.nickName}`;
        reviewList['userAge'] = `${userInfo.userAge}`;
        reviewList['userImg'] = `${userInfo.userImg}`;

        res.status(200).json({ msg: '리뷰 등록 success', reviewList });
    } catch (error) {
        console.log(error);
        res.status(400).send({ msg: '리뷰 등록 fail' });
    }
});

// 리뷰 조회
router.get('/review/:restaurantId', authMiddleware, async (req, res) => {
    const { restaurantId } = req.params;
    try {
        var reviews = await Review.find({ restaurantId });
        res.status(200).json({ msg: '리뷰 조회 success', reviews });
    } catch (error) {
        console.log(error);
        res.status(400).josn({ msg: '리뷰 조회 fail' });
    }
});

// 리뷰 삭제
router.delete('/review/:reviewId', authMiddleware, async (req, res) => {
    const { reviewId } = req.params;
    const review = await Review.find({ _id: reviewId });

    // const url = review[0].reviewImg.split('/');
    // const delFileName = url[url.length - 1];
    try {
        await Review.deleteOne({ _id: reviewId });

        s3.deleteObject(
            {
                Bucket: 'practice2082',
                Key: delFileName,
            },
            (err, data) => {
                if (err) {
                    throw err;
                }
            }
        );
        res.send({ result: '리뷰 삭제 success' });
    } catch {
        res.status(400).send({ msg: '리뷰 삭제 fail' });
    }
});

module.exports = router;
