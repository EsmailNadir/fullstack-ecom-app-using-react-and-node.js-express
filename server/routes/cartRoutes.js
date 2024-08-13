const express = require('express');
const router = express.Router();
const Cart = require('../models/cart');
const auth = require('../middleware/auth');

console.log('Cart routes loaded');

// Get user's cart
router.get('/:userid', auth, async (req, res) => {  
  const userId = req.params.userid;
  console.log(req.params.userid);
  console.log("fetching cart for user:", userId);
  try {
    const cart = await Cart.findOne({ userId }).populate('items.productId');
    console.log('cart found:', cart);
    if (!cart) {
      return res.status(404).json({ message: 'cart not found' });
    }
    res.status(200).json(cart);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ message: error.message });
  }
});

// Add item to cart
router.post('/add', auth, async (req, res) => {
  const { productId, quantity } = req.body;

  // input validation
  if (!productId || !quantity) {
    return res
      .status(400)
      .json({ message: 'product ID and quantity are required' });
  }
  try {
    const cart = await Cart.findOneAndUpdate(
      { userId: req.user.userId },
      { $addToSet: { items: { productId, quantity } } },
      { upsert: true, new: true }
    );
    res.status(201).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// remove item from cart
router.delete('/remove/:itemId', auth, async (req, res) => {
  const { productId } = req.params;

  try {
    const cart = await Cart.findOneAndUpdate(
      { userId: req.user.userId },
      { $pull: { items: {_id:itemId } } }
    );
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    res.status(204).json({ message: "Item removed from cart" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;