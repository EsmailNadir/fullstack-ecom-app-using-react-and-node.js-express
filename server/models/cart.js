// Cart.js
const fetchCart = async () => {
    console.log('Fetching cart...');
    try {
        // ...
    } catch (error) {
        console.error(error);
    }
}

// cart.js (or your Mongoose model file)
const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'products', required: true },
            quantity: { type: Number, required: true, min: 1 },
        }
    ]
});

const cart = mongoose.model('cart', cartSchema);

module.exports = cart;