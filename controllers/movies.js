const { Movie } = require('../models/movie');
const ErrorBadRequest = require('../utils/ErrorBadRequest');
const ErrorForbidden = require('../utils/ErrorForbidden');
const ErrorNotFound = require('../utils/ErrorNotFound');

exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => {
      if (!movies) {
        return ([]);
      }
      return res.send(movies);
    })
    .catch(next);
};

exports.deleteMovieById = (req, res, next) => {
  Movie.findById(req.params.id)
    .orFail(() => {
      throw new ErrorNotFound(`Карточка с ID ${req.params.id} не найдена.`);
    })
    .then((movie) => {
      if (movie.owner.toString() !== req.user._id) {
        throw new ErrorForbidden('Нельзя удалять чужие карточки');
      }
      return Movie.findByIdAndDelete(req.params.id).then(() => {
        res.send({ message: `Карточка с id ${movie._id} удалена` });
      });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const errorMessage = 'Переданы неверные данные';
        next(new ErrorBadRequest(errorMessage));
      } else {
        next(err);
      }
    });
};

exports.createMovie = (req, res, next) => {
  const ownerId = req.user._id;
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    owner: ownerId,
    movieId,
    nameRU,
    nameEN,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        let errorMessage = 'Переданы неверные данные: ';
        const errorValues = Object.values(err.errors);
        errorValues.forEach((errVal) => {
          if (typeof errVal === 'object') {
            errorMessage += `Ошибка в поле ${errVal.path} `;
          }
        });
        next(new ErrorBadRequest(errorMessage));
        return;
      }
      if (err.name === 'CastError') {
        const errorMessage = 'Переданы неверные данные';
        next(new ErrorBadRequest(errorMessage));
      } else {
        next(err);
      }
    });
};
