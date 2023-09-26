const mongoose = require('mongoose');
import isEmail from 'validator/lib/isEmail';

const validateEmail = function(email) {
  return isEmail(email);
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
    required: 'Email address is required',
    validate: [validateEmail, 'Неправильный формат почты'],
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 30,
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
}, { strict: true });

module.exports = mongoose.model('user', userSchema);
