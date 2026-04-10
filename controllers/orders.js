const Order = require("../models/order.js");
const {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} = require("../utils/errors.js");

const createOrder = (req, res, next) => {
  const { clientName, clientPhone, items, status, totalAmount, amountPaid } =
    req.body;
  const owner = req.user._id;

  Order.create({
    clientName,
    clientPhone,
    items,
    status,
    totalAmount,
    amountPaid,
    owner,
  })
    .then((order) => res.status(201).send(order))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Datos de la orden inválidos"));
      } else {
        next(err);
      }
    });
};

const getOrders = (req, res, next) => {
  Order.find({})
    .then((orders) => res.send(orders))
    .catch((err) => next(err));
};

const deleteOrder = (req, res, next) => {
  const { orderId } = req.params;

  Order.findById(orderId)
    .select("+owner")
    .then((order) => {
      if (!order) {
        return next(new NotFoundError("Orden no encontrada"));
      }
      return Order.findByIdAndDelete(orderId).then(() =>
        res.send({ message: "Orden eliminada correctamente" }),
      );
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("ID de orden inválido"));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getOrders,
  createOrder,
  deleteOrder,
};
