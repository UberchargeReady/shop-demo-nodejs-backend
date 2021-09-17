const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const SALT_WORK_FACTOR = 10;
     
const UserSchema = new Schema({
    username: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true },
    token: { type: String, default: "" },
    cart: {
        items: [{ productId: { type: Schema.Types.ObjectId, required: true, ref: 'Product' },
                quantity: { type: Number, required: true } }]
    }
});
     
UserSchema.pre('save', function(next) {
    const user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});
     
UserSchema.methods.comparePassword = function(candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return callback(err);
        callback(null, isMatch);
    });
};

UserSchema.methods.generateToken = function() {
    const user = this;
    user.token = crypto.randomBytes(64).toString('hex');
    user.save();
};

UserSchema.methods.clearToken = function() {
    const user = this;
    user.token = "";
    user.save();
}

UserSchema.methods.addToCart = function(product) {
    const index = this.cart.items.findIndex(function(cartProduct) {
        return cartProduct.productId.toString() === product._id.toString();});
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];

    if (index >= 0) {
        newQuantity = this.cart.items[index].quantity + 1;
        updatedCartItems[index].quantity = newQuantity;
    } else {
        updatedCartItems.push({ productId: product._id, quantity: newQuantity });
    }
    const updatedCart = { items: updatedCartItems };
    this.cart = updatedCart;
    return this.save();
}

UserSchema.methods.modifyQuantity = function(product, newQuantity) {
    const index = this.cart.items.findIndex(function(cartProduct) {
        return cartProduct.productId.toString() === product._id.toString();
    });
    if (index >= 0) {
        const updatedCartItems = [...this.cart.items];
        updatedCartItems[index].quantity = newQuantity;
        const updatedCart = { items: updatedCartItems };
        this.cart = updatedCart;
        return this.save();
    }
}

UserSchema.methods.removeFromCart = function (productId) {
    const updatedCartItems = this.cart.items.filter((cartProduct) => {
        return cartProduct.productId.toString() !== productId.toString();
    });
    this.cart.items = updatedCartItems;
    return this.save();
};
  
UserSchema.methods.clearCart = function () {
    this.cart = { items: [] };
    return this.save();
};
     
module.exports = mongoose.model('User', UserSchema);