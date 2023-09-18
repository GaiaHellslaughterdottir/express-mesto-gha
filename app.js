const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const process = require('process');

const { PORT = 3000 } = process.env;
const app = express();
const PAGE_NOT_FOUND_ERROR = 404;

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

app.use((req, res) => (
  res.status(PAGE_NOT_FOUND_ERROR).send({ message: 'Такая страница не найдена' })
));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
