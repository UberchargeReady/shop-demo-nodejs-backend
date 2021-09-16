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
                req.session.isLoggedIn = true;
                req.session.user = user;
                req.session.save();
                user.generateToken();
                res.send(user);
            } else res.json({ message: 'Incorrect password' });
        })
    }).catch(next);
};

exports.getLogout = function(req, res, next) {
    //User.findOne({ username: req.body.username}).then(function(user) {
    //    if (!user) res.json({ message: "User doesn't exist" });
    //    user.clearToken();
    //    res.send(user);
    //}).catch(next);

    const user = req.session.user;
    user.clearToken();
    req.session.destroy().then(function() {
        req.send(user);
    }).catch(next);
};

exports.getAccount = function(req, res, next) {
    res.send(req.session.user);
};