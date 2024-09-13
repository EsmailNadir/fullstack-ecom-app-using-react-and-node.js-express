import mongoose from 'mongoose'
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    rating: { type: Number, default: 4 },
});

// Register the model with Mongoose
const Product = mongoose.model('Product', productSchema);

export default Product;
