const express = require('express');
const console = require('console');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const { PORT = 3000 } = process.env;
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const { usersRoutes } = require('./routes/users');
const { moviesRoutes } = require('./routes/movies');
const { createUser, login } = require('./controllers/users');
const errorHandler = require('./middlewares/errorHandler');
const validators = require('./middlewares/validations');
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
app.post('/signup', validators.register, express.json(), createUser);
app.post('/signin', validators.register, express.json(), login);
app.use(auth, (req, res, next) => {
  next(new ErrorNotFound('Страница с указаным URL не найдена.'));
});
app.use(errorLogger);
app.use(errors());

app.use(errorHandler);

async function main() {
  await mongoose.connect(MONGO);

  app.listen(PORT, () => {
    console.log(`Server listen on ${PORT}`);
  });
}

main();
