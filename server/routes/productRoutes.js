const express = require('express');
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

// Get all products (public route)
router.get('/products', async (req, res) => {
    try {
        const Products = await Product.find();
        res.json(Products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new product (protected route)
router.post('/products', [auth, admin], async (req, res) => {
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
