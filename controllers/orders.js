const Order = require("../models/order.js");
const { BadRequestError, NotFoundError } = require("../utils/errors.js");

const createOrder = (req, res, next) => {
  const {
    clientName,
    clientPhone,
    items,
    status,
    totalAmount,
    firstPayment,
    secondPayment,
    deliveryDate,
    deliveryDateSuede,
  } = req.body;
  const owner = req.user?._id || req.body.owner;

  Order.create({
    clientName,
    clientPhone,
    items,
    status,
    totalAmount,
    firstPayment,
    secondPayment,
    deliveryDate,
    deliveryDateSuede,
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

const updateOrderStatus = (req, res, next) => {
  const { orderId } = req.params;
  const { status, secondPayment } = req.body;

  Order.findByIdAndUpdate(
    orderId,
    { status, secondPayment },
    { new: true, runValidators: true },
  )
    .then((order) => {
      if (!order) {
        throw new Error("No se encontró la orden");
      }
      res.send(order);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("ID de orden inválido"));
      } else if (err.name === "ValidationError") {
        next(new BadRequestError("Datos de actualización inválidos"));
      } else {
        next(err);
      }
    });
};
module.exports = {
  getOrders,
  createOrder,
  deleteOrder,
  updateOrderStatus,
};
