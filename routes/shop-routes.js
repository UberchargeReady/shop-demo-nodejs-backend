const express = require('express');
const router = express.Router();

const shopController = require('../controllers/shop-controller');

router.get('/', shopController.getEntryPoint);

router.get('/welcome', shopController.getWelcome);

router.get('/products', shopController.getProducts);

router.get('/products/:productId', shopController.getProduct);

router.get('/cart', shopController.getCart);

router.post('/cart/:productId', shopController.postCart);

router.post('/cart-remove-item', shopController.postCartRemoveItem);

router.get('/checkout', shopController.getCheckout);

router.get('/orders', shopController.getOrders);

module.exports = router;