const express = require('express');
const router = express.Router();
const { updateOrder, createOrder, viewOrders, getOrderDetails, getPendingOrders } = require('../controllers/orderController');

router.post('/updateOrder', updateOrder);
router.post('/createOrder', createOrder);
router.post('/viewOrders', viewOrders);
router.post('/getOrderDetails', getOrderDetails);
router.get('/getPendingOrders/:userId', getPendingOrders);

module.exports = router;
