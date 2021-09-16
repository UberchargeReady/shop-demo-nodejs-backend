const Product = require('../models/product');
const Order = require('../models/order');

exports.getEntryPoint = function(req, res, next) {
    res.json({ message: 'Api entry point' });
};

exports.getWelcome = function(req, res, next) {
    res.json({ message: 'Welcome to shop demo api' });
};

exports.getProducts = function(req, res, next) {
    Product.find({}).then(function(products) {
        if (products.length == 0) res.json({ message: "No products in database"});
        res.send(products);
    }).catch(next);
};

exports.getProduct = function(req, res, next) {
    Product.findById(req.params.productId).then(function(product) {
        if (!product) res.json("message", "Product doesn't exist");
        res.send(product);
    }).catch(next);
};

exports.getCart = function(req, res, next) {
    req.session.user.populate('cart.items.productId').execPopulate().then(function(user) {
        const products = user.cart.items;
        res.send(products);
    }).catch(next);
};

exports.postCart = function(req, res, next) {
    Product.findById(req.params.productId).then(function(product) {
        const user = req.session.user;
        user.addToCart(product);
        res.send(user.cart.items);
    }).catch(next);
};

exports.postCartRemoveItem = function(req, res, next) {
    const user = req.session.user;
    user.removeFromCart(req.body.productId).then(function() {
        res.send(user.cart.items);
    }).catch(next);
};

exports.postCartEmpty = function(req, res, next) {
    //todo
};

exports.getCheckout = function(req, res, next) {
    let order;
    req.session.user.populate('cart.items.productId').execPopulate().then(function(user) {
        const products = user.cart.items.map(function(p) {
            return { quantity: p.quantity, product: { ...p.productId._doc } };
        });
        order = new Order({user: { userId: req.session.user}, products });
        return order.save();
    }).then(function() {
        return req.session.user.clearCart();
    }).then(function() {
        res.send(order);
    }).catch(next);
};

exports.getOrders = function(req, res, next) {
    Order.find({ 'user.userId': req.session.user._id }).then(function(orders) {
        res.send(orders);
    }).catch(next);
};



