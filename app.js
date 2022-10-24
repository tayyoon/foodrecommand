require('dotenv').config();
const express = require('express');
const connect = require('./models');
const cors = require('cors');

const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const port = 3000;

const app = express();

connect();
app.use(cors());

const communityRouter = require('./routes/community');
const reviewsRouter = require('./routes/review');
const mypageRouter = require('./routes/mypage');
const commentRouter = require('./routes/comment');

const requestMiddleware = (req, res, next) => {
    console.log('Request URL:', req.originalUrl, ' - ', new Date());
    next();
};
//프론트에서 오는 데이터들을 body에 넣어주는 역할
app.use(express.json());
app.use(requestMiddleware);

//form 형식으로 데이터를 받아오고 싶을 때(false->true)
app.use('/api', express.urlencoded({ extended: false }), communityRouter);
// app.use('/oauth', express.urlencoded({ extended: false }), usersRouter)
app.use('/api', express.urlencoded({ extended: false }), reviewsRouter);
app.use('/api', express.urlencoded({ extended: false }), mypageRouter);
app.use('/api', express.urlencoded({ extended: false }), commentRouter);

app.get('/', (req, res) => {
    res.send('hello');
});

const options = {
    swaggerDefinition: {
        info: {
            title: 'REST API',
            version: '1.0.0',
            description: 'Example docs',
        },
    },
    apis: ['swagger.yaml'],
};

const specs = swaggerJSDoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.listen(port, () => {
    console.log(port, '포트로 서버가 켜졌어요');
});
