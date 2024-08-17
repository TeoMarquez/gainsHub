const express = require('express');
const router = express.Router();
const { viewWishlist, addProductToWishlist, removeProductFromWishlist,  } = require('../controllers/wishlistController.js');

router.post('/addProductToWishlist', addProductToWishlist);
router.post('/viewWishlist', viewWishlist);
router.post('/removeProductFromWishlist', removeProductFromWishlist);

module.exports = router;
