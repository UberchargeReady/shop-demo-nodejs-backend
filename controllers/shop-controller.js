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
    if (req.isLoggedIn) {
        const products = req.user.cart.items;
        res.send(products);
    } else {
        //todo
        next();
    }
};

exports.postCart = function(req, res, next) {
    if (req.isLoggedIn) {
        Product.findById(req.params.productId).then(function(product) {
            if (!product) res.json({ message: "Product doesn't exist" });
            const user = req.user;
            user.addToCart(product);
            res.send(user.cart.items);
        }).catch(next);
    } else {
        //todo
        next();
    }
};

exports.postCartRemoveItem = function(req, res, next) {
    if (req.isLoggedIn) {
        const user = req.user;
        user.removeFromCart(req.body.productId).then(function() {
            res.send(user.cart.items);
        }).catch(next);
    } else {
        //todo
        next();
    }
};

exports.postCartEmpty = function(req, res, next) {
    if (req.isLoggedIn) {
        //todo
    } else {
        //todo
        next();
    }
};

exports.getCheckout = function(req, res, next) {
    if (req.isLoggedIn) {
        const user = req.user;
        const cart = user.cart.items;
        if (cart.length > 0) {
            const order = new Order({ user: user, products: cart });
            order.save();
            user.clearCart();
            res.send(order);
        } else res.json({ message: "Cart is empty" });
    } else {
        //todo
        next();
    }
};

exports.getOrders = function(req, res, next) {
    if (req.isLoggedIn) {
        Order.find({ 'user_id': req.user._id }).then(function(orders) {
            res.send(orders);
        }).catch(next);
    } else {
        //todo
        next();
    }
};



