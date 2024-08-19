const express = require('express');
const router = express.Router();
const { register, login, verifyAccount,getAccount, updateUser } = require('../controllers/userController');

router.post('/register', register);
router.post('/login', login);
router.get('/verify-email', verifyAccount);
router.get('/user-info/:userId', getAccount);
router.put('/update-user/:userId', updateUser);



module.exports = router;
