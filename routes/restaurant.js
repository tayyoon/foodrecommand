const express = require('express');
const Community = require('../models/community');
const Comment = require('../models/comment');
const User = require('../models/user');
const Restaurant = require('../models/restaurant');
const Review = require('../models/review');
const router = express.Router();
const moment = require('moment');
const authMiddleware = require('../middlewares/auth-middleware');

// 음식점 검색 목록 뿌려주기
router.get('/search/:tag', async (req, res, next) => {
    const { tag } = req.query;
    const { region, food, weather, mood } = req.query;
    const { user } = res.locals;
    const { userId, userAddress } = user;
    let restaurantLists;

    try {
        if (
            region.length < 0 &&
            mood.length < 0 &&
            food.length < 0 &&
            weather.length < 0
        ) {
            let restaurantLists = await Restaurant.find({
                restaurantAddress: userAddress,
            });
        } else if (mood.length < 0 && weather.length < 0 && food.length < 0) {
            let restaurantLists = await Restaurant.find({
                restaurantAddress: region,
            });
        } else if (region.length < 0 && weather.length < 0 && food.length < 0) {
            let restaurantLists = await Restaurant.find({
                restaurantMood: mood,
            });
        } else if (region.length < 0 && mood.length < 0 && food.length < 0) {
            let restaurantLists = await Restaurant.find({
                restaurantWeather: weather,
            });
        } else if (region.length < 0 && mood.length < 0 && weather.length < 0) {
            let restaurantLists = await Restaurant.find({
                restaurantFood: food,
            });
        } else if (mood.length < 0 && weather.length < 0) {
            let restaurantLists = await Restaurant.find({
                restaurantRegion: region,
                restaurantFood: food,
            });
        } else if (food.length < 0 && weather.length < 0) {
            let restaurantLists = await Restaurant.find({
                restaurantRegion: region,
                restaurantMood: mood,
            });
        } else if (mood.length < 0 && food.length < 0) {
            let restaurantLists = await Restaurant.find({
                restaurantRegion: region,
                restaurantWeather: weather,
            });
        } else if (region.length < 0 && weather.length < 0) {
            let restaurantLists = await Restaurant.find({
                restaurantMood: mood,
                restaurantFood: food,
            });
        } else if (region.length < 0 && food.length < 0) {
            let restaurantLists = await Restaurant.find({
                restaurantMood: mood,
                restaurantWeather: weather,
            });
        } else if (region.length < 0 && mood.length < 0) {
            let restaurantLists = await Restaurant.find({
                restaurantFood: food,
                restaurantWeather: weather,
            });
        } else if (region.length < 0) {
            let restaurantLists = await Restaurant.find({
                restaurantMood: mood,
                restaurantFood: food,
                restaurantWeather: weather,
            });
        } else if (mood.length < 0) {
            let restaurantLists = await Restaurant.find({
                restaurantRegion: region,
                restaurnatFood: food,
                restaurantWeather: weather,
            });
        } else if (food.length < 0) {
            let restuarantLists = await Restaurant.find({
                restaurantRegion: region,
                restaurantMood: mood,
                restaurantWeather: weather,
            });
        } else if (weather.length < 0) {
            let restaurantLists = await Restaurant.find({
                restaurantRegion: region,
                restaurantMood: mood,
                restaurantFood: food,
            });
        } else {
            let restaurantLists = await Restaurant.find({
                restaurantRegion: region,
                restaurnatFood: food,
                restaurantMoodmood,
                restaurantWeather: weather,
            });
        }
        res.status(200).json({
            msg: '사용자 지역 근처 음식점 리스트 success',
            restaurantLists,
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({ msg: '레스토랑 검색 fail' });
    }
});

// 음식점 리뷰 점수
router.put('/restaurantScore/:restaurantId', async (req, res, next) => {
    const { restaurantId } = res.params;
    const { user } = res.locals;
    const { userId } = user;

    let sum = 0;
    let reviewScores;
    let reviewAverage;

    let reviews = await Review.find({ restaurantId });

    console.log(review);
    // 어떤식으로 담기는지 확인하기, 확인하고 리뷰 스코어만 담기

    for (let i = 0; i < reviews.length; i++) {
        let reviewScore = reviews[i].reviewScore;
        reviewScores.push(reviewScore);
    }
    for (let j = 0; j < reviewScores.length; j++) {
        let sum = sum + reviewScores[j];
        let reviewAverage = sum / reviewScores.length;

        await Review.updateOne(
            { restaurantId },
            { $set: { reviewScore: reviewAverage } }
        );
    }
});

// 음식점 대표 리뷰 설정하기
router.put('/restaurantTag/:restaurantId', async (req, res, next) => {
    const { restaurantId } = req.params;

    let reviewFoods = [];
    let reviewMoods = [];
    let reviewWeathers = [];

    let reviews = await Review.find({ restaurantId });

    for (let i = 0; i < reviews.length; i++) {
        if (reviews[i].reviewMood < 0 && reviews[i].reviewWeather < 0) {
            reviewFoods.push(reviews[i].reviewFood);
        } else if (reviews[i].reviewFood < 0 && reviews[i].reviewWeather < 0) {
            reviewMoods.push(reviews[i].reviewMood);
        } else if (reviews[i].reviewFood < 0 && reviews[i].reviewMood < 0) {
            reviewWeathers.push(reviews[i].reviewWeather);
        } else if (reviews[i].reviewWeather < 0) {
            reviewFoods.push(reviews[i].reviewFood);
            reviewMoods.push(reviews[i].reviewMood);
        } else if (reviews[i].reviewMood < 0) {
            reviewFoods.push(reviews[i].reviewFood);
            reviewWeathers.push(reviews[i].reviewWeather);
        } else if (reviews[i].reviewFood < 0) {
            reviewWeathers.push(reviews[i].reviewWeather);
            reviewMoods.push(reviews[i].reviewMood);
        } else {
            reviewFoods.push(reviews[i].reviewFood);
            reviewMoods.push(reviews[i].reviewMood);
            reviewWeathers.push(reviews[i].reviewWeather);
        }
    }

    let food1,
        food2,
        food3,
        food4,
        food5,
        food6,
        food7,
        food8 = 0;
    for (let j = 0; j < reviewFoods.length; j++) {
        if (reviewFoods[j] === '한식') {
            let food1 = +1;
        } else if (reviewFoods[j] === '양식') {
            let food2 = +1;
        } else if (reviewFoods[j] === '중식') {
            let food3 = +1;
        } else if (reviewFoods[j] === '일식') {
            let food4 = +1;
        } else if (reviewFoods[j] === '베트남') {
            let food5 = +1;
        } else if (reviewFoods[j] === '멕시코') {
            let food6 = +1;
        } else if (reviewFoods[j] === '태국') {
            let food7 = +1;
        } else {
            let food8 = +1;
        }
    }

    let topFood;

    let mood1,
        mood2,
        mood3,
        mood4,
        mood5,
        mood6,
        mood7,
        mood8,
        mood9,
        mood10,
        mood11,
        mood12,
        mood13,
        mood14 = 0;

    for (let j = 0; j < reviewMoods.length; j++) {
        if (reviewFoods[j] === '감성') {
            let mood1 = +1;
        } else if (reviewFoods[j] === '힙한') {
            let mood2 = +1;
        } else if (reviewFoods[j] === '노포') {
            let mood3 = +1;
        } else if (reviewFoods[j] === '레트로') {
            let mood4 = +1;
        } else if (reviewFoods[j] === '편안한') {
            let mood5 = +1;
        } else if (reviewFoods[j] === '조용한') {
            let mood6 = +1;
        } else if (reviewFoods[j] === '시끄러운') {
            let mood7 = +1;
        } else if (reviewFoods[j] === '로맨틱') {
            let mood8 = +1;
        } else if (reviewFoods[j] === '회식') {
            let mood9 = +1;
        } else if (reviewFoods[j] === '연말모임') {
            let mood10 = +1;
        } else if (reviewFoods[j] === '데이트') {
            let mood11 = +1;
        } else if (reviewFoods[j] === '로컬') {
            let mood12 = +1;
        } else if (reviewFoods[j] === '혼밥/혼술') {
            let mood13 = +1;
        } else {
            let mood14 = +1;
        }
    }
    let topMood;

    let weather1,
        weather2,
        weather3,
        weather4,
        weather5,
        weather6,
        weather7 = 0;
    for (let j = 0; j < reviewWeathers.length; j++) {
        if (reviewWeathers[j] === '비') {
            let weather1 = +1;
        } else if (reviewWeathers[j] === '눈') {
            let weather2 = +1;
        } else if (reviewWeathers[j] === '흐림') {
            let weather3 = +1;
        } else if (reviewWeathers[j] === '더움') {
            let weather4 = +1;
        } else if (reviewWeathers[j] === '쌀쌀') {
            let weather5 = +1;
        } else if (reviewWeathers[j] === '선선') {
            let weather6 = +1;
        } else {
            let weather7 = +1;
        }
    }

    let topWeather;

    await Restaurant.updateMany(
        { restaurantId },
        {
            $set: {
                restaurantFood: topFood,
                restaurantMood: topMood,
                restaurantWeather: topWeather,
            },
        }
    );
});
