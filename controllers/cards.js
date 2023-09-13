const Card = require('../models/card');

module.exports.postCard = (req, res) => {
  const userId = req.user._id;
  const {name, link} = req.body;

  Card.create({name, link, owner: userId})
    .then(card => res.send({data: card}))
    .catch((err) => res.status(500).send({message: 'Произошла ошибка ' + err}));
};

module.exports.getCardList = (req, res) => {
  Card.find({})
    .then(card => res.send({data: card}))
    .catch((err) => res.status(500).send({message: 'Произошла ошибка ' + err}));
};

module.exports.deleteCardById = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then(card => res.send({data: card}))
    .catch((err) => res.status(500).send({message: 'Произошла ошибка ' + err}));
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    {$addToSet: {likes: req.user._id}}, // добавить _id в массив, если его там нет
    {new: true}
  )
    .then((card) => res.send({data: card}))
    .catch((err) => res.status(500).send({message: 'Произошла ошибка ' + err}));
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    {$pull: {likes: req.user._id}},
    {new: true}
  )
    .then((card) => res.send({data: card}))
    .catch((err) => res.status(500).send({message: 'Произошла ошибка ' + err}));
};