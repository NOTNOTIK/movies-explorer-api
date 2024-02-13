require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');

const app = express();
const ERROR_CODE = 400;
const SERVER_ERROR = 500;
const ERROR_NOT_FOUND = 404;
const OK = 200;
const CREATED_OK = 201;

const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/NotFoundError'); // 404
const { requestLogger, errorLogger } = require('./middlewares/logger');

const PORT = 3000;
const { DATA_URL = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;
module.exports = {
  ERROR_CODE,
  SERVER_ERROR,
  ERROR_NOT_FOUND,
  OK,
  CREATED_OK,
};
app.use(cors());

mongoose.connect(DATA_URL);
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  }),
);
app.use(requestLogger);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
app.use('/signin', require('./routes/signin'));
app.use('/signup', require('./routes/signup'));

app.use(auth);
app.use('/movies', require('./routes/movies'));
app.use('/users', require('./routes/users'));

app.use(errorLogger);

app.use('*', (req, res, next) => next(new NotFoundError('Страница не найдена')));
app.use(errors());
app.use((err, req, res, next) => {
  const { status = 500, message } = err;
  res.status(status).json({
    message: status === 500 ? 'Ошибка сервера' : message,
  });
  next();
});
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
