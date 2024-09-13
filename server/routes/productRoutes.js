import express from 'express'
import Product from '../models/Product.js';
import auth from '../middleware/auth.js';
import admin from '../middleware/admin.js';

const router = express.Router();


// Get all products (public route)
router.get("/", async (req, res) => {
    console.log("Fetching products"); // Log the request for debugging
  
    try {
      // Retrieve all products from the database
      const products = await Product.find();
  
      // Send the list of products as a JSON response
      res.status(200).json(products);
    } catch (err) {
      // Log the error and send a 500 status with the error message
      console.error("Error fetching products:", err.message);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });


// Create a new product (protected route)
router.post('/', auth, async (req, res) => {
    console.log('Create product route reached!');
    console.log(req.body);
    const product = new Product({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        ratings: req.body.ratings,
        imageUrl: req.body.imageUrl,
    });

    try {
        const newProduct = await product.save();
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
   
});
// update new product
router.put('/update/:id', auth, async (req, res) => {
    try {
      const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!product) return res.status(404).json({ message: 'Product not found' });
      res.json(product);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

router.delete('/delete/:id',auth, async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findByIdAndDelete(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (err) {
        console.error('Error deleting product:', err.message);
        res.status(500).json({ message: 'Failed to delete product' });
    }
});
// Get a single product by ID
router.get("/:id", async (req, res) => {
    console.log("Received request for product ID:", req.params.id);
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

export default router;
