const router = require('express').Router();
const Card = require('../models/card');
const { getCardList, deleteCardById, postCard } = require('../controllers/users');


router.get('/', getCardList);

router.delete('/:cardId', deleteCardById);

router.post('/', postCard);

module.exports = router;
