const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth-controller');

router.post('/signup', authController.postSignUp);

router.post('/login', authController.postLogin);

router.get('/logout', authController.getLogout);

module.exports = router;