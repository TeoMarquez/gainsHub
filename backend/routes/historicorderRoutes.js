const express = require('express');
const router = express.Router();
const { updateHistoricOrders, viewHistoricorders,  } = require('../controllers/historicorderController.js');

router.post('/updateHistoricOrders', updateHistoricOrders);
router.post('/viewHistoricorders', viewHistoricorders);

module.exports = router;
