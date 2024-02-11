const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const validator = require("validator");
const movieSchema = new mongoose.Schema(
  {
    country: {
      type: String,
      required: true,
    },
    director: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      validate: {
        validator: (v) => validator.isURL(v),
        message: "Неправильная ссылка",
      },
      required: true,
    },
    trailerLink: {
      type: String,
      validate: {
        validator: (v) => validator.isURL(v),
        message: "Неправильная ссылка",
      },
      required: true,
    },
    thumbnail: {
      type: String,
      validate: {
        validator: (v) => validator.isURL(v),
        message: "Неправильная ссылка",
      },
      required: true,
    },
    owner: {
      type: ObjectId,
      required: true,
      ref: "user",
    },
    movieId: {
      type: Number,
      required: true,
      ref: "user",
    },
    nameRU: {
      type: String,
      required: true,
    },
    nameEN: {
      type: String,
      required: true,
    },
  },
  { versionKey: false }
);

module.exports = mongoose.model("movie", movieSchema);
