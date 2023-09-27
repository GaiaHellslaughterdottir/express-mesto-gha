const Card = require('../models/card');
const BadRequestError = require('../errors/bad-request');
const NotFoundError = require('../errors/not-found-err');
const UnauthorizedError = require('../errors/unauthorized');

module.exports.postCard = (req, res) => {
  const userId = req.user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner: userId })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Данные карточки введены некорректно');
      }
      throw err;
    });
};

module.exports.getCardList = (req, res) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      throw err;
    });
};

module.exports.deleteCardById = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if ((card) == null) {
        throw new NotFoundError('Такая карточка не найдена');
      }
      if (card.owner !== req.user._id) {
        throw new UnauthorizedError('Доступ запрещён');
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('ID карточки задан не корректно');
      }
      throw err;
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
        throw new NotFoundError('Такая карточка не найдена');
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('ID карточки задан не корректно');
      }
      throw err;
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
        throw new NotFoundError('Такая карточка не найдена');
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('ID карточки задан не корректно');
      }
      throw err;
    });
};
