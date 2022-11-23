const Joi = require('joi');

const user_validation = {
    user_signUp: async (req, res, next) => {
        console.log('req :', req.body);

        const body = req.body;
        const schema = Joi.object().keys({
            userNickName: Joi.string()
                .pattern(new RegExp('^[ㄱ-ㅎa-zA-Z0-9가-힣]{1,8}$'))
                .required(), //특수문자만안되고 글자수는 1~8글자
            userAge: Joi.string().required(),
            userGender: Joi.array().required(),
            userContent: Joi.string()
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
                message: '유저정보작성이 잘못되었습니다! 확인해주세요!',
            });
        }
        next();
    },
};

module.exports = user_validation;
