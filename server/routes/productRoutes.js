const express = require('express');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

const router = express.Router();

const admin = async (req, res, next) => {
    if (req.user.role === 'admin') {
      next(); // Allow admin access
    } else {
      return res.status(403).json({ message: 'Access denied' });
    }
  };

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
router.post('/create', [auth, admin], async (req, res) => {
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
router.delete('/delete/:id', [auth, admin], async (req, res) => {
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

module.exports =  router ;
