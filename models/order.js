const mongoose = require('mongoose');


const orderSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
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

    items: [{
        description: String, 
        price: Number,
        serviceId: String,
    }],
    status: {
        type: String,
        enum: ['Recibido', 'Entregado'],
        default: 'Recibido'
    },

    totalAmount: {type: Number, required: true},
    amountPaid: {type: Number, default: 0}


});

module.exports = mongoose.model('order', orderSchema);