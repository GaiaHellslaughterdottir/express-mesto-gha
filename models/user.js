const mongoose = require('mongoose');
const isURL = require('validator/lib/isURL');
const isEmail = require('validator/lib/isEmail');

const validateEmail = function (email) {
  return isEmail(email);
};

const validateUrl = function (url) {
  return isURL(url);
};

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    default: 'Исследователь',
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    index: true,
    required: true,
    validate: [validateEmail, 'Неправильный формат почты'],
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: [validateUrl, 'Неправильный формат ссылки'],
  },
}, { strict: true });

module.exports = mongoose.model('user', userSchema);
