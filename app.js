const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const process = require('process');
const http2 = require('http2');
const { login, postUser } = require('./controllers/users');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {});

app.use(bodyParser.json()); // для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true })); // для приёма

app.use((req, res, next) => {
  req.user = {
    _id: '65019b15dce31977c97e53d1',
  };
  next();
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use('/signup', postUser);
app.use('/signin', login);

app.use((req, res) => (
  res.status(http2.constants.HTTP_STATUS_NOT_FOUND).send({ message: 'Такая страница не найдена' })
));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
