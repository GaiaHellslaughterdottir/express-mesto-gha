const http2 = require('http2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports.postUser = (req, res) => {
  const { name, about, avatar, email, password } = req.body;

  bcrypt.hash(password, 10)
    .then(hash => User.create({ name, about, avatar, email, password: hash })
      .then((user) => res.send({ data: user }))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          console.log(err);
          return res.status(http2.constants.HTTP_STATUS_BAD_REQUEST).send({ message: 'Данные пользователя введены некорректно' });
        }
        return res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: `Произошла ошибка ${err.text}` });
      }))
    .catch((err) => res.status(http2.constants.HTTP_STATUS_BAD_REQUEST).send(err));
};

module.exports.getUserList = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: `Произошла ошибка ${err.text}` }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user == null) {
        return res.status(http2.constants.HTTP_STATUS_NOT_FOUND).send({ message: 'Такой пользователь не найден' });
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(http2.constants.HTTP_STATUS_BAD_REQUEST).send({ message: 'ID пользователя задан не корректно' });
      }
      return res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: `Произошла ошибка ${err.text}` });
    });
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => (
      res.send({ data: user })))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(http2.constants.HTTP_STATUS_BAD_REQUEST).send({ message: 'Данные пользователя введены некорректно' });
      }
      return res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: `Произошла ошибка ${err.text}` });
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => (
      res.send({ data: user })))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(http2.constants.HTTP_STATUS_BAD_REQUEST).send({ message: 'Данные пользователя введены некорректно' });
      }
      return res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: `Произошла ошибка ${err.text}` });
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      if (!bcrypt.compare(password, user.password)) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.cookie('jwt', token, {
          maxAge: 604800000,
          httpOnly: true
        })
        .end();
    })
    .catch((err) => {
      res
        .status(http2.constants.HTTP_STATUS_UNAUTHORIZED)
        .send({ message: err.message });
    });

  bcrypt.hash(password, 10)
    .then(hash => {

    })
    .then((user) => res.send(user))
    .catch((err) => res.status(400).send(err));
};
