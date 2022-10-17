const mongoose = require('mongoose');

const connect = () => {
    mongoose
        .connect('mongodb://localhost:27017/일단은 로컬로 합니까', {
            ignoreUndefined: true,
        })
        .catch((err) => {
            console.error(err);
        });
};

module.exports = connect;
