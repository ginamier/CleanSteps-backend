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
                idCalzado: Joi.string().required(),
                descripcion: Joi.string().required(),
                precio: Joi.number().required(),
                
            })  
        ).required(),
        status: Joi.string().valid('recibido', 'entregado').default('recibido'),
        totalAmount: Joi.number().required(),
        amountPaid: Joi.number(),
        secondPayment: Joi.number(),
        deliveryDate: Joi.string().required(),
        deliveryDateSuede: Joi.string().allow(''),
        owner: Joi.string().hex().length(24),
    }),
}), createOrder);

router.delete('/:orderId', celebrate({
        params: Joi.object().keys({
            orderId: Joi.string().length(24).hex().required(),
        }),
    }), deleteOrder);

module.exports= router;