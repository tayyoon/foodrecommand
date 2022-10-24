const mongoose = require('mongoose');

const RestaurantSchema = new mongoose.Schema({
    restaurantId: {
        type: String,
        required: true,
        unique: true,
    },
    restaurantName: {
        type: String,
        required: true,
    },
    restaurantPhone: {
        type: String,
    },
    restaurantAddress: {
        type: String,
    },
    restaurantScore: {
        type: Number,
        required: true,
    },
    createAt: {
        type: String,
        required: true,
    },
    restaurantLike: {
        type: Number,
        default: 0,
    },
});

RestaurantSchema.virtual('restaurantId').get(function () {
    return this._id.toHexString();
});
RestaurantSchema.set('toJSON', {
    virtuals: true,
});

module.exports = mongoose.model('Restaurant', RestaurantSchema);
