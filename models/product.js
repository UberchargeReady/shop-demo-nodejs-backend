const mongoose = require('mongoose');
require('mongoose-double')(mongoose);
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    name: { type: String, required: true, index: { unique: true } },
    stock: { type: Number, required: true , min: 0 },
    price: { type: mongoose.SchemaTypes.Double, required: true , min: 0 }
});

module.exports = mongoose.model('Product', ProductSchema);