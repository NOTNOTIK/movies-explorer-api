const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OK } = require('../app');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;

const NotFoundError = require('../errors/NotFoundError'); // 404
const BadRequestError = require('../errors/BadRequestError'); // 400
const ConflictError = require('../errors/ConflictError'); // 409
const AuthError = require('../errors/AuthError');
// 401
module.exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    return res.status(OK).json(users);
  } catch (err) {
    return next(err);
  }
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => res.status(OK).send(user))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return next(new NotFoundError('Пользователь с таким ID не найден'));
      }
      return next(err);
    });
};
module.exports.getOneUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      res.status(200).send({
        user,
      });
    })
    .catch(next);
};
module.exports.createUser = (req, res, next) => {
  const { email, password, name } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => res.status(OK).json({ name: user.name, email: user.email }))
    .catch((err) => {
      if (err.code === 11000) {
        return next(
          new ConflictError('Пользователь с таким email уже существует'),
        );
      }
      return next(err);
    });
};
module.exports.updateUser = (req, res, next) => {
  const owner = req.user._id;
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    owner,
    { name, email },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((user) => res.status(OK).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Невалидные данные'));
      }
      if (err.name === 'DocumentNotFoundError') {
        return next(new NotFoundError('ID not found'));
      }
      if (err.code === 11000) {
        return next(new ConflictError('Нет доступа'));
      }
      return next(err);
    });
};

module.exports.login = async (req, res, next) => {
  const { email, password } = req.body || {};
  try {
    const userAdmin = await User.findOne({ email }).select('+password');
    console.log(userAdmin);
    const matched = await bcrypt.compare(password, userAdmin.password);
    if (!matched) {
      return next(new AuthError('NotAuthenticate'));
    }
    const token = jwt.sign(
      { _id: userAdmin._id },
      NODE_ENV === 'production' ? JWT_SECRET : 'super-strong-secret',
      {
        expiresIn: '7d',
      },
    );
    return res.status(200).send({
      email: userAdmin.email,
      id: userAdmin._id,
      token,
    });
  } catch (err) {
    return next(err);
  }
};
