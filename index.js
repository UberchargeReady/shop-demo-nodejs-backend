const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.static('public'));
app.use(express.json());

// initialize routes
const BASE_API_ENDPOINT = "/api";
const ADMIN_ENDPOINT = "/admin";

const shopRoutes = require('./routes/shop-routes');
const authRoutes = require('./routes/auth-routes');
const adminRoutes = require('./routes/admin-routes');

app.use(BASE_API_ENDPOINT, shopRoutes);
app.use(BASE_API_ENDPOINT, authRoutes);
app.use(BASE_API_ENDPOINT + ADMIN_ENDPOINT, adminRoutes);

// error handling
app.use(function(err, req, res, next){
    //console.error(err);
    res.status(422).send({error: err.message});
 });

// connect to mongodb
const MONGODB_URI_DEV = "mongodb+srv://dbAdmin:geo123@cluster0.xwh1u.mongodb.net/shopDemoDb?retryWrites=true&w=majority";
const PORT_DEV = 4000;

//mongoose.connect('mongodb://localhost/shopDemoDb');
mongoose.connect(process.env.MONGODB_URI || MONGODB_URI_DEV).then(function() {
    // listen for requests
    app.listen(process.env.PORT || PORT_DEV, function() {
        console.log("Listening on port " + PORT_DEV);
    });
});