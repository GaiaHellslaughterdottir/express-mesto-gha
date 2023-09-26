const router = require('express').Router();
const {
  postUser, getUserList, getUserById, updateProfile, updateAvatar, login
} = require('../controllers/users');

router.get('/', getUserList);

router.get('/:userId', getUserById);

router.post('/signup', postUser);

router.patch('/me', updateProfile);

router.patch('/me/avatar', updateAvatar);

router.post('/signin', login);

module.exports = router;
