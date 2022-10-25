const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    // commentId: {
    //     type: String,
    //     required: true,
    //     unique: true,
    // },
    // (postId를 조회해서 어떤 글에 대한 댓글인지 확인)
    postId: {
        type: String,
        required: true,
    },
    // (userId를 조회해서 nickname, userImg가져오기)
    userId: {
        type: String,
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
    commentLike: {
        type: Number,
        default: 0,
    },
    createAt: {
        type: String,
        required: true,
    },
});

CommentSchema.virtual('commentId').get(function () {
    return this._id.toHexString();
});
CommentSchema.set('toJSON', {
    virtuals: true,
});

module.exports = mongoose.model('Comment', CommentSchema);
