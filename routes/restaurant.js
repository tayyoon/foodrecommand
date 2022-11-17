const express = require('express');
const Community = require('../models/community');
const Comment = require('../models/comment');
const User = require('../models/user');
const Restaurant = require('../models/restaurant');
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
router.put('/restaurant/:restaurantId', async (req, res, next) => {
    const { restaurantId } = res.params;
    const { user } = res.locals;
    const { userId } = user;
});
