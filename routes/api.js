const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Product = require('../models/product');
const Order = require('../models/Order');

router.get('/welcome', function(req, res) {
    res.json({ message: 'Welcome to shop demo api'});
});

router.post('/user/create', function(req, res, next) {
    User.create(req.body).then(function(user){
        res.send(user);
    }).catch(next);
});

router.post('/user/login', function(req, res, next) {
    User.findOne({ username: req.body.username}).then(function(user) {
        if (!user) res.json({ message: "User doesn't exist" });
        user.comparePassword(req.body.password, function(err, isMatch) {
            if (isMatch) {
                user.generateToken();
                res.send(user);
            } else res.json({ message: 'Incorrect password' });
        })
    }).catch(next);
});

router.post('/user/logout', function(req, res, next) {
    //todo
});

router.get('/users', function(req, res, next) {
    User.find({}).then(function(users) {
        if (users.length == 0) res.json({ message: "No users in database" });
        res.send(users);
    }).catch(next);
});

router.route('/products')
    // create a product
    .post(function(req, res, next) {
        Product.create(req.body).then(function(product) {
            res.send(product);
        }).catch(next);
    })
    // get all products
    .get(function(req, res, next) {
        Product.find({}).then(function(products) {
            if (products.length == 0) res.json({ message: "No products in database"});
            res.send(products);
        }).catch(next);
    });

// update a product
router.put('/products/:id',function(req,res,next) {
    Product.findOneAndUpdate({_id: req.params.id}, req.body).then(function(product) {
        Product.findOne({_id: req.params.id}).then(function(product) {
            res.send(product);
        });
    }).catch(next);
});

module.exports = router;