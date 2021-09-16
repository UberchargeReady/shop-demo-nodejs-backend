const express = require('express');
const mongoose = require('mongoose');

const User = require('./models/user');

const shopRoutes = require('./routes/shop-routes');
const authRoutes = require('./routes/auth-routes');
const adminRoutes = require('./routes/admin-routes');

const BASE_API_ENDPOINT = "/api";
const ADMIN_ENDPOINT = "/admin";

const MONGODB_URI_DEV = "mongodb+srv://dbAdmin:geo123@cluster0.xwh1u.mongodb.net/shopDemoDb?retryWrites=true&w=majority";
const PORT_DEV = 4000;

const app = express();

app.use(express.static('public'));
app.use(express.json());

app.get('/', function(req, res) {
    res.json({ project: "Shop demo NodeJS", author: "George Ntaitzikis" });
});

// user session
//app.use(function(req, res, next) {
//    req.user = null;
//    req.isLoggedIn = false;
//    const reqId = req.get('user_id');
//    const reqToken = req.get('user_token');
//    if (!reqId) return next();
//    User.findById(reqId).then(function(user) {
//        if (!user) return next();
//        req.user = user;
//        if (reqToken && reqToken === user.token) req.isLoggedIn = true;
//        return next();
//    }).catch(next);
//});

// initialize routes
app.use(BASE_API_ENDPOINT, shopRoutes);
app.use(BASE_API_ENDPOINT, authRoutes);
app.use(BASE_API_ENDPOINT + ADMIN_ENDPOINT, adminRoutes);

// error handling
app.use(function(err, req, res, next){
    if (!err) {
        console.error(err);
        res.send({error: err.message});
    }
 });

// connect to mongodb
//mongoose.connect('mongodb://localhost/shopDemoDb');
mongoose.connect(process.env.MONGODB_URI || MONGODB_URI_DEV).then(function() {
    // listen for requests
    app.listen(process.env.PORT || PORT_DEV, function() {
        console.log("Listening on port " + PORT_DEV);
    });
});