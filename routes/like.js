require('dotenv').config();
const express = require('express');
const Community = require('../models/community');
const Comment = require('../models/comment');
const User = require('../models/user');
const Review = require('../models/review');
const Restaurant = require('../models/restaurant');
const Like = require('../models/like');

const router = express.Router();
const jwt = require('jsonwebtoken');
const moment = require('moment');

const authMiddleware = require('../middlewares/auth-middleware');

// 좋아요
router.put('/like', authMiddleware, async (req, res) => {
    const { commentId, communityId, reviewId, restaurantId } = req.body;
    const { user } = res.locals;
    const { userId } = user;

    if (communityId.length > 0) {
        const community = await Community.findOne({ _id: communityId });
        console.log(community);
        let like = community[0]['communityLike'];
        console.log(like);

        await Community.updateOne(
            { _id: communityId },
            { $set: { communityLike: like + 1 } }
        );
        await Like.create({ userId, postId: communityId });
        return;
    } else if (restaurantId.length > 0) {
        const restaurant = await Restaurant.findOne({ _id: restaurantId });
        console.log(restaurant);
        let like = restaurant[0]['restaurantLike'];
        console.log(like);

        await Restaurant.updateOne(
            { _id: restaurantId },
            { $set: { restaurantLike: like + 1 } }
        );
        await Like.create({ userId, postId: restaurantId });
        return;
    } else if (reviewId.length > 0) {
        const review = await Review.findOne({ _id: reviewId });
        console.log(review);
        let like = review[0]['reviewLike'];
        console.log(like);

        await Review.updateOne(
            { _id: reviewId },
            { $set: { reviewLike: like + 1 } }
        );
        await Like.create({ userId, postId: reviewId });
        return;
    } else if (commentId.length > 0) {
        const comment = await Comment.findOne({ _id: commentId });
        console.log(comment);
        let like = comment[0]['commentLike'];
        console.log(like);

        await Comment.updateOne(
            { _id: commentId },
            { $set: { commentLike: like + 1 } }
        );
        await Like.create({ userId, postId: commentId });
        return;
    }

    res.status(200).json({ msg: '좋아요 success' });
});

// 아니좋아요~
router.delete('/unlike', authMiddleware, async (req, res) => {
    const { user } = res.locals;
    const { userId } = user;
    const { commentId, communityId, reviewId, restaurantId } = req.body;

    if (communityId.length > 0) {
        const community = await Community.findOne({ _id: communityId });
        console.log(community);
        let like = community[0]['communityLike'];
        console.log(like);

        await Community.updateOne(
            { _id: communityId },
            { $set: { communityLike: like - 1 } }
        );
        await Like.findOneAndDelete(
            { userId, postId: communityId },
            { userId }
        );

        return;
    } else if (restaurantId.length > 0) {
        const restaurant = await Restaurant.findOne({ _id: restaurantId });
        console.log(restaurant);
        let like = restaurant[0]['restaurantLike'];
        console.log(like);

        await Restaurant.updateOne(
            { _id: restaurantId },
            { $set: { restaurantLike: like - 1 } }
        );
        await Like.findOneAndDelete(
            { userId, postId: restaurantId },
            { userId }
        );

        return;
    } else if (reviewId.length > 0) {
        const review = await Review.findOne({ _id: reviewId });
        console.log(review);
        let like = review[0]['reviewLike'];
        console.log(like);

        await Review.updateOne(
            { _id: reviewId },
            { $set: { reviewLike: like - 1 } }
        );
        await Like.findOneAndDelete({ userId, postId: reviewId }, { userId });

        return;
    } else if (commentId.length > 0) {
        const comment = await Comment.findOne({ _id: commentId });
        console.log(comment);
        let like = comment[0]['commentLike'];
        console.log(like);

        await Comment.updateOne(
            { _id: commentId },
            { $set: { commentLike: like - 1 } }
        );
        await Like.findOneAndDelete({ userId, postId: commentId }, { userId });

        return;
    }

    res.status(200).json({ msg: '안! 좋아요 success' });
});

module.exports = router;
