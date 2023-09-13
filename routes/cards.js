const router = require('express').Router();
const { getCardList, deleteCardById, postCard, likeCard, dislikeCard } = require('../controllers/cards');


router.get('/', getCardList);

router.delete('/:cardId', deleteCardById);

router.post('/', postCard);

router.put('/:cardId/likes', likeCard);

router.delete('/:cardId/likes', dislikeCard);

module.exports = router;
