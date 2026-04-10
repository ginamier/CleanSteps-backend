const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {getOrders, createOrder, deleteOrder} = require('../controllers/orders');

router.get('/', getOrders);

router.post('/',celebrate({
    body: Joi.object().keys({
        clientName: Joi.string().required(),
        clientPhone: Joi.string().required(),
        items: Joi.array().items(
            Joi.object().keys({
                description: Joi.string(),
                price: Joi.number(),
                serviceId: Joi.string(),
            })  
        ).required(),
        status: Joi.string().valid('Recibido', 'Entregado').default('Recibido'),
        totalAmount: Joi.number().required(),
        amountPaid: Joi.number().default(0),
    }),
}), createOrder);

router.delete('/:orderId', celebrate({
        params: Joi.object().keys({
            orderId: Joi.string().length(24).hex().required(),
        }),
    }), deleteOrder);

module.exports= router;