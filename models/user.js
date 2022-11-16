const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    // userId: {
    //     type: String,
    //     required: true,
    //     unique: true,
    // },
    userNickname: {
        type: String,
        required: true,
        unique: true,
    },
    // 추후 추가기능으로?
    // userGender: {
    //     type: String,
    //     required: true,
    // },
    userAddress: {
        type: String,
        required: true,
    },
    userImg: {
        type: String,
    },
    userEmail: {
        type: String,
        required: true,
    },
    userAddress: {
        type: String,
        required: true,
    },
});

UserSchema.virtual('userId').get(function () {
    return this._id.toHexString();
});
UserSchema.set('toJSON', {
    virtuals: true,
});

module.exports = mongoose.model('User', UserSchema);
