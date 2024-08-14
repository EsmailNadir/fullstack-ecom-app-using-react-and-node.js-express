const express = require('express');
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

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
router.post('/', [auth, admin], async (req, res) => {
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

module.exports = router;
