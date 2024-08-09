

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
cartSchema.index({ user_id: 1 });
cartSchema.index({ product_id: 1 });

module.exports = mongoose.model('Cart', cartSchema);