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
        req.user.populate('cart.items.productId').then(function(user) {
            res.send(user);
        })
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
            if (req.body.quantity) {
                user.modifyQuantity(product, req.body.quantity);
            }
            else {
                user.addToCart(product);
            }
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
        user.removeFromCart(req.params.productId).then(function() {
            res.send(user.cart.items);
        }).catch(next);
    } else {
        //todo
        next();
    }
};

exports.postCartEmpty = function(req, res, next) {
    if (req.isLoggedIn) {
        req.user.clearCart();
        res.send(req.user.cart.items);
    } else {
        //todo
        next();
    }
};

exports.getCheckout = function(req, res, next) {
    if (req.isLoggedIn) {
        if (req.user.cart.items.length > 0) {
            req.user.populate('cart.items.productId').then(function(user) {
                const products = user.cart.items.map((product) => {
                    return { quantity: product.quantity, product: {...product.productId._doc} };
                });
                const order = new Order({ user: user, products: products });
                order.save();
                user.clearCart();
                res.send(order);
            })
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



