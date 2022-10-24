const mongoose = require('mongoose');

const likesSchema = new mongoose.Schema({
    userId: {
        type: String,
    },
    postId: {
        type: String,
    },
});

module.exports = mongoose.model('likes', likesSchema);
