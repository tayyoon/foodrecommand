const Joi = require('joi');

const community_validation = {
    user_signUp: async (req, res, next) => {
        console.log('req :', req.body);

        const body = req.body;
        const schema = Joi.object().keys({
            communityTitle: Joi.string()
                .pattern(new RegExp('^[!?~.^ㄱ-ㅎ|가-힣|a-z|A-Z|0-9 ]{1,50}$'))
                .required(),
            communityImg: Joi.array().items(min(0), max(5)),
            communityDesc: Joi.string()
                .pattern(new RegExp('^[!?~.^ㄱ-ㅎ|가-힣|a-z|A-Z|0-9 ]{1,100}$'))
                .required(),
        });
        try {
            // 검사시작
            await schema.validateAsync(body);
        } catch (error) {
            // 유효성 검사 에러
            console.log(error);
            return res.status(400).json({
                message: '커뮤니티 작성이 잘못되었습니다! 확인해주세요!',
            });
        }
        next();
    },
};

module.exports = community_validation;
