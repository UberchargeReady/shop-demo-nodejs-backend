const Product = require('../models/product');
const User = require('../models/user');
const Order = require('../models/order');

exports.getUser = function(req, res, next) {
    User.findById(req.params.userId).then(function(user) {
        if (!user) res.json("message", "User doesn't exist");
        res.send(user);
    }).catch(next);
};

exports.getUsers = function(req, res, next) {
    User.find({}).then(function(users) {
        if (users.length == 0) res.json({ message: "No users in database" });
        res.send(users);
    }).catch(next);
};

exports.getOrder = function(req, res, next) {
    Order.findById(req.params.orderId).then(function(order) {
        if (!order) res.json("message", "Order doesn't exist");
        res.send(order);
    }).catch(next);
};

exports.getOrders = function(req, res, next) {
    Order.find({}).then(function(orders) {
        if (orders.length == 0) res.json({ message: "No orders in database" });
        res.send(orders);
    }).catch(next);
};

exports.getOrdersUser = function(req, res, next) {
    //todo
};

exports.postAddProduct = function(req, res, next) {
    Product.create(req.body).then(function(product) {
        res.send(product);
    }).catch(next);
};

exports.postEditProduct = function(req, res, next) {
    const productId = req.body.productId;
    const newName = req.body.name;
    const newStock = req.body.stock;
    const newPrice = req.body.price;

    Product.findById(productId).then(function(product) {
        product.name = newName;
        product.stock = newStock;
        product.price = newPrice;
        return product.save().then(function() {
            res.send(product);
        });
    }).catch(next);
};

exports.deleteProduct = function(req, res, next) {
    const productId = req.params.productId;
    Product.findById(productId).then(function(product) {
        if (!product) res.json("message", "Product not found");

        // delete product from all users' carts
        User.find({}, (err, users) => {
            users.forEach((user) => {
                user.removeFromCart(prodId);
            });
        });
        return Product.deleteOne({ _id: productId, userId: req.session.user._id })
    }).then(function() {
        res.status(200).json("message", "Product deleted");
    }).catch(function(err) {
        console.log(err);
        res.status(500).json("message", "Failed to delete product");
    })
};