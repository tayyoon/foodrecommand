const express = require('express');
const User = require('../models/user');
const Community = require('../models/community');
const Review = require('../models/review');
const Restaurant = require('../models/restaurant');

const router = express.Router();
const moment = require('moment');
// const upload = require('../S3/s3');
const authMiddleware = require('../middlewares/auth-middleware');

// 리뷰 등록
router.post(
    '/review/:restaurnatId',
    // upload.array('image', 5), // image upload middleware
    async (req, res) => {
        try {
            const { restaurnatId } = req.params;
            const restaurant = await Restaurant.findOne({ _id: restaurnatId });
            const { user } = res.locals;
            const { userId, userNickname } = user;
            const { restaurantName, restaurantPhone, restaurantAdress } =
                restaurant;
            const {
                reviewTitle,
                reviewDesc,
                reviewScore,
                reviewImg,
                reviewTagFood,
                reviewTagWeather,
                reviewTagMood,
            } = req.body;

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
                reviewTagFood,
                reviewTagWeather,
                reviewTagMood,
                userId,
                nickName: 'a',
                userImg: 'a',
                createAt: createdAt,
            });
            const userInfo = await User.findOne({
                userId,
            });

            reviewList['nickName'] = `${userInfo.nickName}`;
            reviewList['userImg'] = `${userInfo.userImg}`;

            res.status(200).json({ msg: '리뷰 등록 success', reviewList });
        } catch (error) {
            console.log(error);
            res.status(400).send({ msg: '리뷰 등록 fail' });
        }
    }
);

// 리뷰 수정
router.put(
    '/reviewEdit/:reviewId',
    // upload.array('image', 5), // image upload middleware
    async (req, res, next) => {
        const id = req.params.reviewId;
        const { user } = res.locals;
        const { userId, userNickname } = user;
        const {
            reviewTitle,
            reviewDesc,
            reviewScore,
            reviewImg,
            reviewTagFood,
            reviewTagWeather,
            reviewTagMood,
        } = req.body;
        console.log(content, title, id);
        const o_id = new Object(id);
        const today = new Date();
        const date = today.toLocaleString();
        //         // const image = req.file?.location; // file.location에 저장된 객체imgURL
        //         // if (!image) {
        //         //     return res.status(400).send({
        //         //         message: '이미지 파일을 추가해주세요.',
        //         //     });
        //         // }
        //         // console.log('image', image);
        //         // const [detail] = await Posts.find({ _id: o_id });
        //         // console.log(detail);
        //         // const imagecheck = detail.image;
        //         // console.log(imagecheck);
        //         // const deleteimage = imagecheck.split('/')[3];
        //         // console.log(deleteimage);
        //         // s3.putObject(
        //         //     {
        //         //         Bucket: 'image-posting',
        //         //         Key: `${deleteimage}`,
        //         //     },
        //         //     (err, data) => {
        //         //         console.log(err);
        //         //         if (err) {
        //         //             throw err;
        //         //         }
        //         //     }
        //         // );

        try {
            await Community.updateOne(
                { _id: o_id },
                {
                    $set: {
                        reviewTitle,
                        reviewDesc,
                        reviewScore,
                        reviewImg,
                        reviewTagFood,
                        reviewTagWeather,
                        reviewTagMood,
                        userId,
                        nickName: 'a',
                        userImg: 'a',
                        createAt: date,
                    },
                }
            );
            const userInfo = await User.findOne({
                userId,
            });

            reviewList['nickName'] = `${userInfo.nickName}`;
            reviewList['userImg'] = `${userInfo.userImg}`;

            res.status(200).send({
                message: '수정 완료',
            });
        } catch (err) {
            res.status(400).send({
                message: '수정 실패',
            });
        }
    }
);

// 리뷰 조회
router.get('/review/:restaurantId', async (req, res) => {
    const { restaurantId } = req.params;

    const { user } = res.locals;
    const { userId } = user;

    try {
        var reviews = await Review.find({ restaurantId })
            .sort()
            .skip((pageNumber - 1) * 6)
            .limit(5);
        let userInfo = '';
        for (let i = 0; i < reviews.length; i++) {
            userInfo = await User.findOne({
                userId: reviews[i].userId,
            });
            reviews[i]['nickName'] = `${userInfo.nickName}`;
            reviews[i]['userImg'] = `${userInfo.userImg}`;
        }
        res.status(200).json({ msg: '리뷰 조회 success', reviews });
    } catch (error) {
        console.log(error);
        res.status(400).josn({ msg: '리뷰 조회 fail' });
    }
});

// 리뷰 삭제
router.delete('/review/:reviewId', async (req, res) => {
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
