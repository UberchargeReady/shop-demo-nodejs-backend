const User = require('../models/user');

exports.postSignUp = function(req, res, next) {
    User.create(req.body).then(function(user){
        res.send(user);
    }).catch(next);
};

exports.postLogin = function(req, res, next) {
    User.findOne({ username: req.body.username }).then(function(user) {
        if (!user) res.json({ message: "User doesn't exist" });
        user.comparePassword(req.body.password, function(err, isMatch) {
            if (isMatch) {
                user.generateToken();
                res.send(user);
            } else res.json({ message: 'Incorrect password' });
        })
    }).catch(next);
};

exports.getLogout = function(req, res, next) {
    User.findOne({ username: req.body.username}).then(function(user) {
        if (!user) res.json({ message: "User doesn't exist" });
        user.clearToken();
        res.send(user);
    }).catch(next);
};