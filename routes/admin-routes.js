const express = require('express');
const router = express.Router();

const adminController = require('../controllers/admin-controller');

router.get('/users/:userId', adminController.getUser);

router.get('/users', adminController.getUsers);

router.get('/orders/:orderId', adminController.getOrder);

router.get('/orders', adminController.getOrders);

router.get('/orders/:userId', adminController.getOrdersUser);

router.post('/products', adminController.postAddProduct);

router.post('/product/edit', adminController.postEditProduct);

router.delete('/product/:productId', adminController.deleteProduct);

module.exports = router;