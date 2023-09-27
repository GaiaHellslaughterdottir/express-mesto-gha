const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const process = require('process');
const http2 = require('http2');
const { login, postUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const UnauthorizedError = require('./errors/unauthorized');
const BadRequestError = require('./errors/bad-request');
const NotFoundError = require('./errors/not-found-err');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/signup', postUser);
app.use('/signin', login);

app.use(auth);

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use(() => {
  throw new NotFoundError('Такая страница не найдена');
});

app.use((err, req, res, next) => {
  console.log(err);
  if (err instanceof UnauthorizedError) {
    res.status(http2.constants.HTTP_STATUS_UNAUTHORIZED)
      .send({ message: err.message });
  } else if (err instanceof BadRequestError) {
    res.status(http2.constants.HTTP_STATUS_BAD_REQUEST)
      .send({ message: err.message });
  } else if (err instanceof NotFoundError) {
    res.status(http2.constants.HTTP_STATUS_NOT_FOUND)
      .send({ message: err.message });
  } else {
    res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
