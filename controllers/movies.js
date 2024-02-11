const {
  OK,

  CREATED_OK,
} = require("../app");
const Movie = require("../models/movie");
const NotFoundError = require("../errors/NotFoundError.js"); // 404
const BadRequestError = require("../errors/BadRequestError.js"); // 400
const UserError = require("../errors/UserError.js"); // 403
module.exports.getMovies = async (req, res, next) => {
  try {
    const movies = await Movie.find({});
    return res.status(OK).json(movies);
  } catch (err) {
    return next(err);
  }
};
module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId).then((movie) => {
    if (!movie) {
      next(new NotFoundError("Карточка не найдена"));
      return;
    }
    if (movie.owner.toString() !== req.user._id) {
      next(new UserError("Невозможно удалить чужую карточку"));
      return;
    }
    movie
      .deleteOne()
      .then(() => res.send({ message: "Карточка удалена" }))
      .catch((err) => {
        if (err.name === "CastError") {
          next(new BadRequestError("Переданы некорректные данные"));
        } else {
          next(err);
        }
      });
  });
};

module.exports.addMovie = async (req, res, next) => {
  try {
    const {
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      thumbnail,
      nameRU,
      nameEN,
      movieId,
    } = req.body;
    const movie = await Movie.create({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      thumbnail,
      nameRU,
      nameEN,
      movieId,
      owner: req.user._id,
    });
    return res.status(CREATED_OK).json(movie);
  } catch (err) {
    if (err.name === "ValidationError") {
      return next(
        new BadRequestError("Невалидные данные при создании карточки")
      );
    }
    return next(err);
  }
};
