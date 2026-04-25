const { NODE_ENV, JWT_SECRET } = process.env;
const {
  ConflictError,
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} = require("../utils/errors.js");
const bcrypt = require("bcryptjs");
const User = require("../models/user.js");
const jwt = require("jsonwebtoken");

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const secretKey =
        NODE_ENV === "production" ? JWT_SECRET : "super-strong-secret";
      const token = jwt.sign({ _id: user._id }, secretKey, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      next(new UnauthorizedError("Correo o contraseña incorrectos"));
    });
};

const createUser = (req, res, next) => {
  const { name, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({
        name,
        email,
        password: hash,
      }),
    )
    .then((user) => {
      const userResponse = user.toObject();
      delete userResponse.password;
      res.status(201).send(userResponse);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Datos de registro inválidos"));
      } else if (err.code === 11000) {
        next(new ConflictError("Este correo ya está registrado"));
      } else {
        next(err);
      }
    });
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError("Usuario no encontrado"));
      }
      res.send(user);
    })
    .catch((err) => next(err));
};

const updateUser = (req, res, next) => {
  const { name, email } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    { name, email },
    {
      returnDocument: "after",
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError("Usuario no encontrado");
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Datos de actualización inválidos"));
      } else if (err.code === 11000) {
        next(new ConflictError("Este correo ya está en uso por otro usuario"));
      } else {
        next(err);
      }
    });
};

module.exports = { createUser, getCurrentUser, login, updateUser };
