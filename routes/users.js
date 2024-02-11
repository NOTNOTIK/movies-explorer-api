const userRouter = require("express").Router();
const {
  getUsers,
  getUserById,
  getOneUser,
  updateUser,
} = require("../controllers/users");
const { Joi, celebrate } = require("celebrate");
userRouter.get("/", getUsers);
userRouter.get("/:id", getUserById);
userRouter.get("/me", getOneUser);
userRouter.patch(
  "/me",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      email: Joi.string().required().email(),
    }),
  }),
  updateUser
);
module.exports = userRouter;
