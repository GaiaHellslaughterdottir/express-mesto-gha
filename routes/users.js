const router = require('express').Router();
const User = require('../models/user');
const { postUser, getUserList, getUserById } = require('../controllers/users');

router.get('/', getUserList);

router.get('/:userId', getUserById);

router.post('/', postUser);

module.exports = router;
