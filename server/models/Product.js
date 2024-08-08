const mongoose = require('mongoose');

const productsSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    rating: {type:Number, default:0},
});

const Products = mongoose.model('Products', productsSchema);

module.exports = Products;
