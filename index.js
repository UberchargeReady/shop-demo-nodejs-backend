const express = require('express');
const mongoose = require('mongoose');
const app = express();

const MONGODB_URI = "mongodb+srv://dbAdmin:geo123@cluster0.xwh1u.mongodb.net/shopDemoDb?retryWrites=true&w=majority";
const PORT = 4000;

app.use(express.static('public'));
app.use(express.json());

// initialize routes
app.use('/api', require('./routes/api'));

// error handling
app.use(function(err, req, res, next){
    //console.error(err);
    res.status(422).send({error: err.message});
 });

// connect to mongodb
//mongoose.connect('mongodb://localhost/shopDemoDb');
mongoose.connect(MONGODB_URI).then(function() {
    // listen for requests
    app.listen(process.env.port || PORT, function() {
        console.log("Listening on port " + PORT);
    });
});