const User = require('../models/user');

const PAGE_NOT_FOUND_ERROR = 404;
const BAD_REQUEST_ERROR = 400;
const INTERNAL_SERVER_ERROR = 500;

module.exports.postUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST_ERROR).send({ message: 'Данные пользователя введены некорректно' });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: `Произошла ошибка ${err.text}` });
    });
};

module.exports.getUserList = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(INTERNAL_SERVER_ERROR).send({ message: `Произошла ошибка ${err.text}` }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user == null) {
        return res.status(PAGE_NOT_FOUND_ERROR).send({ message: 'Такой пользователь не найден' });
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST_ERROR).send({ message: 'ID пользователя задан не корректно' });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: `Произошла ошибка ${err.text}` });
    });
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => (
      res.send({ data: user })))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST_ERROR).send({ message: 'Данные пользователя введены некорректно' });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: `Произошла ошибка ${err.text}` });
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => (
      res.send({ data: user })))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST_ERROR).send({ message: 'Данные пользователя введены некорректно' });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: `Произошла ошибка ${err.text}` });
    });
};
