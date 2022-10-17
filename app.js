const express = require('express');
const connect = require('./models');
const cors = require('cors');
const port = 3000;

const app = express();

connect();
app.use(cors());

const requestMiddleware = (req, res, next) => {
    console.log('Request URL:', req.originalUrl, ' - ', new Date());
    next();
};
//프론트에서 오는 데이터들을 body에 넣어주는 역할
app.use(express.json());
app.use(requestMiddleware);

app.get('/', (req, res) => {
    res.send('hello');
});

app.listen(port, () => {
    console.log(port, '포트로 서버가 켜졌어요');
});
