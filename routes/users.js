const router = require('express').Router();
const {
  getUserList, getUserById, updateProfile, updateAvatar, getCurrentUser,
} = require('../controllers/users');

router.get('/', getUserList);

router.get('/:userId', getUserById);

router.patch('/me', updateProfile);

router.patch('/me/avatar', updateAvatar);

router.get('/me', getCurrentUser);

module.exports = router;
