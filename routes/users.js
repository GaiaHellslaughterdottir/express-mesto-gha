const router = require('express').Router();
const {
  postUser, getUserList, getUserById, updateProfile, updateAvatar,
} = require('../controllers/users');

router.get('/', getUserList);

router.get('/:userId', getUserById);

router.post('/', postUser);

router.patch('/me', updateProfile);

router.patch('/me/avatar', updateAvatar);

module.exports = router;
