const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("../utils/errors");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(new UnauthorizedError("Se requiere inicio de sesión"));
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    const secretKey =
      NODE_ENV === "production" ? JWT_SECRET : "super-strong-secret";
    payload = jwt.verify(token, secretKey);
  } catch (err) {
    return next(new UnauthorizedError("Token inválido"));
  }

  req.user = { _id: payload._id };
  next();
};
