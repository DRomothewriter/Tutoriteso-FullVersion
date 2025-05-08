const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const authMiddleware = require('../middleware/auth');


router.post('/',authMiddleware, orderController.createOrder);
router.get('/',authMiddleware, orderController.getOrders);
router.get('/:id',authMiddleware, orderController.getOrderById);

module.exports = router;

