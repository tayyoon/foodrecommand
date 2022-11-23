const express = require('express');
const User = require('../models/user');
const Community = require('../models/community');
const Comment = require('../models/comment');

const router = express.Router();
const moment = require('moment');
const authMiddleware = require('../middlewares/auth-middleware');
// const upload = require('../S3/s3');
// const Joi = require('joi');
// const post_validation = require('../vaildation/post.val')

// 전체 커뮤니티 리스트: 무한스크롤 적용, 페이지네이션,
router.get('/communityList/:pageNumber', async (req, res) => {
    const { pageNumber } = req.params;
    const { user } = res.locals;
    const { userId } = user;
    try {
        let wholeCommunity = await Community.find({})
            .sort({ $natural: -1 })
            .skip((pageNumber - 1) * 6)
            .limit(5);
        let userInfo = '';
        for (let i = 0; i < wholeCommunity.length; i++) {
            userInfo = await User.findOne({
                userId: wholeCommunity[i].userId,
            });
            wholeCommunity[i]['nickName'] = `${userInfo.nickName}`;
            wholeCommunity[i]['userImg'] = `${userInfo.userImg}`;
        }
        res.status(200).json({
            wholeCommunity,
            msg: '전체 커뮤니티 리스트 success',
        });
    } catch (error) {
        console.log(error);
        res.status(400).send('전체 커뮤니티 리스트 fail');
    }
});

// 커뮤니티 리스트: 지역으로 솔트
router.get('/communityList/:region', async (req, res) => {
    const { region } = req.params;
    const { user } = res.locals;
    const { userId } = user;
    try {
        let regionCommunity = await Community.find({ region })
            .sort({ $natural: -1 })
            .skip((pageNumber - 1) * 6)
            .limit(5);
        let userInfo = '';
        for (let i = 0; i < regionCommunity.length; i++) {
            userInfo = await User.findOne({
                userId: regionCommunity[i].userId,
            });
            regionCommunity[i]['nickName'] = `${userInfo.nickName}`;
            regionCommunity[i]['userImg'] = `${userInfo.userImg}`;
        }
        res.status(200).json({
            regionCommunity,
            msg: '지역별 커뮤니티 리스트 success',
        });
    } catch (error) {
        console.log(error);
        res.status(400).send('지역별 커뮤니티 리스트 fail');
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
    // upload.array('image',5),
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

// 커뮤니티 수정
router.put(
    '/communityEdit/:communityId',
    // post_validation.post_wirte, (vaildation 예외처리시 활성화)
    // upload.array('image',5),
    async (req, res, next) => {
        //작성한 정보 가져옴
        const { communityId } = req.params;
        const { communityTitle, communityDesc, communityImg } = req.body;

        console.log(communityId, communityTitle, communityDesc, communityImg);

        // 사용자 브라우저에서 보낸 쿠키를 인증미들웨어통해 user변수 생성, 구조분해할당으로 인식이 되지않아 구조분해할당 해제
        const { user } = res.locals;
        const { userId, userNickname } = user.userId;

        // 글작성시각 생성
        require('moment-timezone');
        moment.tz.setDefault('Asia/Seoul');
        const createdAt = String(moment().format('YYYY-MM-DD HH:mm:ss'));

        try {
            var communityList = await Community.create({
                userId,
                userNickname,
                communityTitle,
                communityDesc,
                communityImg,
                createAt: createdAt,
            });
            const userInfo = await User.findOne({
                userId: userId,
            });

            communityList['nickName'] = `${userInfo.nickName}`;
            communityList['userImg'] = `${userInfo.userImg}`;

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

//글 수정하기API
// router.put(
//     '/communityEdit/:communityId',
//     upload.single('image'), // image upload middleware
//     async (req, res, next) => {
//         const { id } = req.params;
//         const { content, title } = req.body;
//         console.log(content, title, id);
//         const o_id = new Object(id);
//         const today = new Date();
//         const date = today.toLocaleString();
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

//         try {
//             await Community.updateOne(
//                 { _id: o_id },
//                 { $set: { content, title, date, image } }
//             );

//             res.status(200).send({
//                 message: '수정 완료',
//             });
//         } catch (err) {
//             res.status(400).send({
//                 message: '수정 실패',
//             });
//         }
//     }
// );

// 게시글 삭제
router.delete(
    '/communityDelete/:communityId',

    async (req, res) => {
        const { communityId } = req.params;

        // const url = review[0].reviewImg.split('/');
        // const delFileName = url[url.length - 1];

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

// 커뮤니티 조회수
// router.put();

module.exports = router;
