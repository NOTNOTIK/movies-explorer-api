const mongoose = require("mongoose");
const isEmail = require("validator/lib/isEmail");
const isURL = require("validator/lib/isURL");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "Александр",
      minlength: 2,
      maxlength: 30,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      validate: {
        validator: (v) => isEmail(v),
        message: "Неправильный формат почты",
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  { versionKey: false }
);

module.exports = mongoose.model("user", userSchema);
