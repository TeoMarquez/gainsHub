const express = require('express');
const router = express.Router();
const { updateProduct, addNewProduct  } = require('../controllers/productController');

router.post('/addNewProduct', addNewProduct);
router.post('/updateProduct', updateProduct);

module.exports = router;
