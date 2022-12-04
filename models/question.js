const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    // questionId: {
    //     type: String,
    //     required: true,
    // },
    questionType: {
        type: String,
        required: true,
    },
    questionTitle: {
        type: String,
        required: true,
    },
    questionDesc: {
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
});

QuestionSchema.virtual('questionId').get(function () {
    return this._id.toHexString();
});
QuestionSchema.set('toJSON', {
    virtuals: true,
});

module.exports = mongoose.model('Question', QuestionSchema);
