const express = require('express');
const router = express.Router();
const { handleDelete } = require('../controllers/softDelete');
const { createSession } = require('../controllers/paymentController');

router.post('/softDelete', handleDelete);
router.post('/create-payment', createSession);

router.get('/test', (req, res) => {
    res.send('Test route is working');
  });
  
module.exports = router;
