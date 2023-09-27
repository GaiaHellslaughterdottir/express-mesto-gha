const http2 = require('http2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../errors/bad-request');
const NotFoundError = require('../errors/not-found-err');

module.exports.postUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    })
      .then((user) => res.send({ data: user }))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          throw new BadRequestError('Данные пользователя введены некорректно');
        }
        throw err;
      }))
    .catch(() => {
      throw new BadRequestError();
    });
};

module.exports.getUserList = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      throw err;
    });
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user == null) {
        throw new NotFoundError('Такой пользователь не найден');
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('ID пользователя задан не корректно');
      }
      throw err;
    });
};

module.exports.getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user == null) {
        throw new NotFoundError('Такой пользователь не найден');
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('ID пользователя задан не корректно');
      }
      throw err;
    });
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => (
      res.send({ data: user })))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Данные пользователя введены некорректно');
      }
      throw err;
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => (
      res.send({ data: user })))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Данные пользователя введены некорректно');
      }
      throw err;
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      if (!bcrypt.compare(password, user.password)) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      return res.cookie('jwt', token, {
        maxAge: 604800000,
        httpOnly: true,
      })
        .end();
    })
    .catch((err) => {
      res
        .status(http2.constants.HTTP_STATUS_UNAUTHORIZED)
        .send({ message: err.message });
    });
};
