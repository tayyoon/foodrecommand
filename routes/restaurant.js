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

    let foods = {
        food1: 0,
        food2: 0,
        food3: 0,
        food4: 0,
        food5: 0,
        food6: 0,
        food7: 0,
        food8: 0,
    };

    for (let j = 0; j < reviewFoods.length; j++) {
        if (reviewFoods[j] === '한식') {
            foods.food1 = foods.food1 + 1;
        } else if (reviewFoods[j] === '양식') {
            foods.food2 = foods.food2 + 1;
        } else if (reviewFoods[j] === '중식') {
            foods.food3 = foods.food3 + 1;
        } else if (reviewFoods[j] === '일식') {
            foods.food4 = foods.food4 + 1;
        } else if (reviewFoods[j] === '베트남') {
            foods.food5 = foods.food5 + 1;
        } else if (reviewFoods[j] === '멕시코') {
            foods.food6 = foods.food6 + 1;
        } else if (reviewFoods[j] === '태국') {
            foods.food7 = foods.food7 + 1;
        } else {
            foods.food8 = foods.food8 + 1;
        }
    }

    let topFood;

    let moods = {
        mood1: 0,
        mood2: 0,
        mood3: 0,
        mood4: 0,
        mood5: 0,
        mood6: 0,
        mood7: 0,
        mood8: 0,
        mood9: 0,
        mood10: 0,
        mood11: 0,
        mood12: 0,
        mood13: 0,
        mood14: 0,
    };

    for (let j = 0; j < reviewMoods.length; j++) {
        if (reviewFoods[j] === '감성') {
            moods.mood1 = moods.mood1 + 1;
        } else if (reviewFoods[j] === '힙한') {
            moods.mood2 = moods.mood2 + 1;
        } else if (reviewFoods[j] === '노포') {
            moods.mood3 = moods.mood3 + 1;
        } else if (reviewFoods[j] === '레트로') {
            moods.mood4 = moods.mood4 + 1;
        } else if (reviewFoods[j] === '편안한') {
            moods.mood5 = moods.mood5 + 1;
        } else if (reviewFoods[j] === '조용한') {
            moods.mood6 = moods.mood6 + 1;
        } else if (reviewFoods[j] === '시끄러운') {
            moods.mood7 = moods.mood7 + 1;
        } else if (reviewFoods[j] === '로맨틱') {
            moods.mood8 = moods.mood8 + 1;
        } else if (reviewFoods[j] === '회식') {
            moods.mood9 = moods.mood9 + 1;
        } else if (reviewFoods[j] === '연말모임') {
            moods.mood10 = moods.mood10 + 1;
        } else if (reviewFoods[j] === '데이트') {
            moods.mood11 = moods.mood11 + 1;
        } else if (reviewFoods[j] === '로컬') {
            moods.mood12 = moods.mood12 + 1;
        } else if (reviewFoods[j] === '혼밥/혼술') {
            moods.mood13 = moods.mood13 + 1;
        } else {
            moods.mood14 = moods.mood14 + 1;
        }
    }
    let topMood;

    let weathers = {
        weather1: 0,
        weather2: 0,
        weather3: 0,
        weather4: 0,
        weather5: 0,
        weather6: 0,
        weather7: 0,
    };

    function getObjKey(obj, value) {
        return Object.keys(obj).find((key) => obj[key] === value);
    }

    for (let j = 0; j < reviewWeathers.length; j++) {
        if (reviewWeathers[j] === '비') {
            weathers.weather1 = weathers.weather1 + 1;
        } else if (reviewWeathers[j] === '눈') {
            weathers.weather2 = weathers.weather2 + 1;
        } else if (reviewWeathers[j] === '흐림') {
            weathers.weather3 = weathers.weather3 + 1;
        } else if (reviewWeathers[j] === '더움') {
            weathers.weather1 = weathers.weather4 + 1;
        } else if (reviewWeathers[j] === '쌀쌀') {
            weathers.weather1 = weathers.weather5 + 1;
        } else if (reviewWeathers[j] === '선선') {
            weathers.weather1 = weathers.weather6 + 1;
        } else {
            weathers.weather1 = weathers.weather7 + 1;
        }
    }

    let maxWeather = Math.max(
        weathers.weather1,
        weathers.weather2,
        weathers.weather3,
        weathers.weather4,
        weathers.weather5,
        weathers.weather6,
        weathers.weather7,
        weathers.weatehr8
    );
    if (maxWeather === weather1) {
    }

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
