const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const ordersControllers = require('../controllers/ordersControllers');

router.get('/', checkAuth, ordersControllers.orders_get_all);

router.post('/', checkAuth, ordersControllers.orders_create_order);

router.get('/:orderId', checkAuth, ordersControllers.orders_get_order);

router.delete('/:orderId', checkAuth, ordersControllers.orders_delete_order);

router.delete('/', checkAuth, ordersControllers.orders_delete_all);

module.exports = router;