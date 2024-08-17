const express = require('express');
const router = express.Router();
const { updateOrder, createOrder, viewOrders } = require('../controllers/orderController');

router.post('/updateOrder', updateOrder);
router.post('/createOrder', createOrder);
router.post('/viewOrders', viewOrders);

module.exports = router;
