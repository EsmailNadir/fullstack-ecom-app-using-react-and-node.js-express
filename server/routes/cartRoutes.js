const express = require('express');
const router = express.Router();
const Cart = require('../models/cart');
const auth = require('../middleware/auth');

console.log('Cart routes loaded');

// Get user's cart
router.get('/:userId', auth, async (req, res) => {
    console.log('GET /api/cart route executed');
    try {
        const cart = await Cart.findOne({ userId: req.params.userId }).populate('items.productId');
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        res.json(cart); // send cart data back to client
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});


// Add item to cart
router.post('/api/cart/add', auth, async (req, res) => {
    console.log('POST /api/cart/add');
    const { productId, quantity } = req.body;

    try {
        let cart = await Cart.findOne({ userId: req.user.userId });
        if (!cart) {
            cart = new Cart({ userId: req.user.userId, items: [] });
        }

        const itemIndex = cart.items.findIndex(item => item.productId == productId);
        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity;
        } else {
            cart.items.push({ productId, quantity });
        }

        await cart.save();
        res.status(201).json(cart);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});

// Remove item from cart
router.delete('/api/cart/remove/:productId', auth, async (req, res) => {
    console.log('DELETE /api/cart/remove/:productId');
    const { productId } = req.params;

    try {
        let cart = await Cart.findOne({ userId: req.user.userId });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        cart.items = cart.items.filter(item => item.productId != productId);
        await cart.save();
        res.json(cart);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;
