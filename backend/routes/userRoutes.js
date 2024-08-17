const express = require('express');
const router = express.Router();
const { register, login, verifyAccount } = require('../controllers/userController');

router.post('/register', register);
router.post('/login', login);
router.get('/verify-email', verifyAccount);



module.exports = router;
