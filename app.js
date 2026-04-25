require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const errorHandler = require("./middlewares/errorHandler");
const auth = require("./middlewares/auth");
const { login, createUser } = require("./controllers/users");
const cors = require("cors");
const { celebrate, Joi, errors } = require("celebrate");

const { requestLogger, errorLogger } = require("./middlewares/logger");

const { PORT = 3001 } = process.env;
const app = express();

const userRouter = require("./routes/users");
const orderRouter = require("./routes/orders");

mongoose
  .connect(process.env.DB_ADDRESS || "mongodb://localhost:27017/cleanstepsdb")
  .then(() => {})
  .catch((err) => {
    throw new Error(`Fallo en la conexión de base de datos: ${err.message}`);
  });

const allowedOrigins = [
  "https://cleansteps.mooo.com",
  "http://cleansteps.mooo.com",
  "https://api.cleansteps.mooo.com",
  "http://localhost:5173",
  "http://localhost:3000",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("No permitido por CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(helmet());

app.use(express.json());

app.use(requestLogger);

app.post(
  "/signin",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login,
);

app.post(
  "/signup",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      email: Joi.string().required().email(),
      password: Joi.string().required().min(4),
    }),
  }),
  createUser,
);

app.use(auth);

app.use("/users", userRouter);
app.use("/orders", orderRouter);

app.use((req, res) => {
  res.status(404).send({ message: "La ruta solicitada no existe" });
});

app.use(errorLogger);

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {});
