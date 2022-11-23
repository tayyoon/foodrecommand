const Joi = require('joi');

const review_validation = {
    user_signUp: async (req, res, next) => {
        console.log('req :', req.body);

        const body = req.body;
        const schema = Joi.object().keys({
            reviewTitle: Joi.string()
                .pattern(new RegExp('^[!?~.^ㄱ-ㅎ|가-힣|a-z|A-Z|0-9 ]{1,50}$'))
                .required(),
            reviewScore: Joi.number().required(),
            reviewImg: Joi.array().items(min(0), max(5)),
            reviewTagFood: Joi.string(),
            reviewTagWeather: Joi.string(),
            reviewTagMood: Joi.string(),
            reviewDesc: Joi.string()
                .pattern(new RegExp('^[!?~.^ㄱ-ㅎ|가-힣|a-z|A-Z|0-9 ]{1,200}$'))
                .required(),
        });
        try {
            // 검사시작
            await schema.validateAsync(body);
        } catch (error) {
            // 유효성 검사 에러
            console.log(error);
            return res.status(400).json({
                message: '리뷰 작성이 잘못되었습니다! 확인해주세요!',
            });
        }
        next();
    },
};

module.exports = review_validation;
