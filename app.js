const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const process = require('process');
const http2 = require('http2');
const { Joi, celebrate, errors } = require('celebrate');
const { login, postUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const UnauthorizedError = require('./errors/unauthorized');
const BadRequestError = require('./errors/bad-request');
const NotFoundError = require('./errors/not-found-err');
const ConflictError = require('./errors/conflict');
const ForbiddenError = require('./errors/forbidden');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(/(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?\/[a-zA-Z0-9]{2,}|((https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?)|(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})?/),
    email: Joi.string().required().regex(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/),
    password: Joi.string().required(),
  }),
}), postUser);
app.use('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().regex(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/),
    password: Joi.string().required(),
  }),
}), login);

app.use(auth);

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use(() => {
  throw new NotFoundError('Такая страница не найдена');
});

app.use(errors());

app.use((err, req, res, next) => {
  if (err instanceof UnauthorizedError) {
    res.status(err.statusCode)
      .send({ message: err.message });
  } else if (err instanceof BadRequestError) {
    res.status(err.statusCode)
      .send({ message: err.message });
  } else if (err instanceof NotFoundError) {
    res.status(err.statusCode)
      .send({ message: err.message });
  } else if (err instanceof ConflictError) {
    res.status(err.statusCode)
      .send({ message: err.message });
  } else if (err instanceof ForbiddenError) {
    res.status(err.statusCode)
      .send({ message: err.message });
  } else {
    res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: err.message });
  }
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
