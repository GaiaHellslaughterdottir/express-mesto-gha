const User = require('../models/user');

module.exports.postUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then(user => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: 'Произошла ошибка' + err }));
};

module.exports.getUserList = (req, res) => {
  User.find({})
    .then(user => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: 'Произошла ошибка' + err }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then(user => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: 'Произошла ошибка' + err }));
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