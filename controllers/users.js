const User = require('../models/user');

module.exports.postUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then(user => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
          return res.status(400).send({ message: 'Данные пользователя введены некорректно' });
      } else {
        return res.status(500).send({ message: 'Произошла ошибка ' + err.text });
      }
    });
};

module.exports.getUserList = (req, res) => {
  User.find({})
    .then(user => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: 'Произошла ошибка' + err }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then(user => {
      if (user == null) {
        return res.status(404).send({ message: 'Такой пользователь не найден' });
      } else {
        res.send({ data: user })
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'ID пользователя задан не корректно' });
      } else {
        return res.status(500).send({ message: 'Произошла ошибка ' + err.text });
      }
    });
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about })
    .then(user => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: 'Произошла ошибка' + err }));
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar })
    .then(user => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: 'Произошла ошибка' + err }));
};