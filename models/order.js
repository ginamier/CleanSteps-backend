const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },

  clientName: {
    type: String,
    required: true,
  },

  clientPhone: {
    type: String,
    required: true,
  },

  items: [
    {
      descripcion: String,
      precio: Number,
      idCalzado: String,
    },
  ],
  status: {
    type: String,
    enum: ["recibido", "entregado"],
    default: "recibido",
  },

  totalAmount: { type: Number, required: true },
  amountPaid: { type: Number, default: 0 },

  secondPayment: {
    type: Number,
    default: 0,
  },
  deliveryDate: {
    type: String,
    required: true,
  },
  deliveryDateSuede: {
    type: String,
  },
});

module.exports = mongoose.model("order", orderSchema);
