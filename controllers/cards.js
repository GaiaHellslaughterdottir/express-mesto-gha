const Card = require('../models/card');

const PAGE_NOT_FOUND_ERROR = 404;
const BAD_REQUEST_ERROR = 400;
const INTERNAL_SERVER_ERROR = 500;

module.exports.postCard = (req, res) => {
  const userId = req.user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner: userId })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST_ERROR).send({ message: 'Данные карточки введены некорректно' });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: `Произошла ошибка ${err.text}` });
    });
};

module.exports.getCardList = (req, res) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(INTERNAL_SERVER_ERROR).send({ message: `Произошла ошибка ${err.text}` }));
};

module.exports.deleteCardById = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if ((card) == null) {
        return res.status(PAGE_NOT_FOUND_ERROR).send({ message: 'Такая карточка не найдена' });
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST_ERROR).send({ message: 'ID карточки задан не корректно' });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: `Произошла ошибка ${err.text}` });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if ((card) == null) {
        return res.status(PAGE_NOT_FOUND_ERROR).send({ message: 'Такая карточка не найдена' });
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST_ERROR).send({ message: 'ID карточки задан не корректно' });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: `Произошла ошибка ${err.text}` });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if ((card) == null) {
        return res.status(PAGE_NOT_FOUND_ERROR).send({ message: 'Такая карточка не найдена' });
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST_ERROR).send({ message: 'ID карточки задан не корректно' });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: `Произошла ошибка ${err.text}` });
    });
};
