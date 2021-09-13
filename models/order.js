const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    date: { type: Date, default: Date.now },
    user: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'User' },
    products: [{ product: { type: Object, required: true}, 
                quantity: { type: Number, required: true}}]
});

module.exports = mongoose.model('Order', OrderSchema);