const mongoose = require('mongoose');

const CommunitySchema = new mongoose.Schema({
    communityId: {
        type: String,
        required: true,
        unique: true,
    },
    communityTitle: {
        type: String,
        required: true,
    },
    communityDesc: {
        type: String,
        required: true,
    },
    communityView: {
        type: Number,
    },
    userId: {
        type: String,
        required: true,
        unique: true,
    },
    userNickname: {
        type: String,
        required: true,
    },
    communityImg: {
        type: String,
    },
    createAt: {
        type: String,
        required: true,
    },
    communityLike: {
        type: Number,
        default: 0,
    },
});

CommunitySchema.virtual('communityId').get(function () {
    return this._id.toHexString();
});
CommunitySchema.set('toJSON', {
    virtuals: true,
});

module.exports = mongoose.model('Community', CommunitySchema);
