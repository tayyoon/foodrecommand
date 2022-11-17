const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    // reviewId: {
    //     type: String,
    //     required: true,
    //     unique: true,
    // },
    restaurantId: {
        type: String,
        required: true,
    },
    reviewRegion: {
        type: String,
    },
    reviewFood: {
        type: String,
    },
    reviewWeather: {
        type: String,
    },
    reviewMood: {
        type: String,
    },
    reviewScore: {
        type: Number,
        required: true,
    },
    reviewTitle: {
        type: String,
        required: true,
    },
    reviewDesc: {
        type: String,
        required: true,
    },
    createAt: {
        type: String,
        required: true,
    },
    reviewImg: {
        type: String,
        required: true,
    },
    reviewLike: {
        type: Number,
        default: 0,
    },
});

ReviewSchema.virtual('reviewId').get(function () {
    return this._id.toHexString();
});
ReviewSchema.set('toJSON', {
    virtuals: true,
});

module.exports = mongoose.model('Review', ReviewSchema);
