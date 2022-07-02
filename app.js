const express = require('express');
const console = require('console');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const {
  PORT = 3000,
  DB_URL = 'https://api.mesto.ralchenko.nomoredomains.xyz/moviesdb',
  NODE_ENV,
} = process.env;
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const { usersRoutes } = require('./routes/users');
const { moviesRoutes } = require('./routes/movies');
const errorHandler = require('./middlewares/errorHandler');
const ErrorNotFound = require('./utils/ErrorNotFound');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const auth = require('./middlewares/auth');
const { MONGO } = require('./config/index');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use(cookieParser());
app.use(requestLogger);
app.use(usersRoutes);
app.use(moviesRoutes);
app.use(auth, (req, res, next) => {
  next(new ErrorNotFound('Страница с указаным URL не найдена.'));
});
app.use(errorLogger);
app.use(errors());

app.use(errorHandler);

async function main() {
  await mongoose.connect(NODE_ENV === 'production' ? DB_URL : MONGO);

  app.listen(PORT, () => {
    console.log(`Server listen on ${PORT}`);
  });
}

main();
