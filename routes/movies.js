const express = require('express');
const {
  getMovies,
  createMovie,
  deleteMovieById,
} = require('../controllers/movies');
const auth = require('../middlewares/auth');
const validators = require('../middlewares/validations');

const moviesRoutes = express.Router();

moviesRoutes.get('/movies', auth, getMovies);

moviesRoutes.post('/movies', validators.movie, auth, express.json(), createMovie);

moviesRoutes.delete('/movies/:id', validators.movieId, auth, deleteMovieById);

exports.moviesRoutes = moviesRoutes;
