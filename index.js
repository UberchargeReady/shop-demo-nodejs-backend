const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const mongoDBStore = require('connect-mongodb-session')(session);

const User = require('./models/user');

const shopRoutes = require('./routes/shop-routes');
const authRoutes = require('./routes/auth-routes');
const adminRoutes = require('./routes/admin-routes');

const BASE_API_ENDPOINT = "/api";
const ADMIN_ENDPOINT = "/admin";

const MONGODB_URI_DEV = "mongodb+srv://dbAdmin:geo123@cluster0.xwh1u.mongodb.net/shopDemoDb?retryWrites=true&w=majority";
const PORT_DEV = 4000;

const app = express();
const store = new mongoDBStore({
    uri: process.env.MONGODB_URI || MONGODB_URI_DEV,
    collection: 'sessions'
});

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    store
}));

app.use(express.static('public'));
app.use(express.json());

app.get('/', function(req, res) {
    res.json({ project: "Shop demo NodeJS", author: "George Ntaitzikis" });
});

// initialize routes
app.use(BASE_API_ENDPOINT, shopRoutes);
app.use(BASE_API_ENDPOINT, authRoutes);
app.use(BASE_API_ENDPOINT + ADMIN_ENDPOINT, adminRoutes);

// user session
app.use(function(req, res, next) {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id).then(function(user) {
        if (!user) return next();
        req.user = user;
        next();
    }).catch(next);
});

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