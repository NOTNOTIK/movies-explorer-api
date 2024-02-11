const jwt = require("jsonwebtoken");
const { NODE_ENV, JWT_SECRET } = process.env;
const AuthError = require("../errors/AuthError.js"); // 401
module.exports = (req, res, next) => {
  let payload;
  try {
    const token = req.headers.authorization;
    if (!token) {
      return next(new AuthError("NotAuthenticated"));
    }

    const validToken = token.replace("Bearer ", "");

    payload = jwt.verify(
      validToken,
      NODE_ENV === "production" ? JWT_SECRET : "super-strong-secret"
    );
  } catch (error) {
    if (error.message === "NotAuthenticated") {
      return next(new AuthError("Неправильные email или пароль"));
    }
    if (error.name === "JsonWebTokenError") {
      return next(new AuthError("С токеном что-то не так"));
    }

    return next(error);
  }
  req.user = payload;
  next();
};
