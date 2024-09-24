import express from 'express';
import mongoose from 'mongoose';
const { ObjectId } = mongoose.Types;
import Cart from '../models/cart.js';
import auth from '../middleware/auth.js';
const router = express.Router();

// Get user's cart
router.get("/", auth, async (req, res) => {
  const userId = req.user.userId;

  try {
    const cart = await Cart.findOne({ userId }).populate("items.productId");
    
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update item quantity in cart
router.put("/update/:itemId", auth, async (req, res) => {
  const { itemId } = req.params;
  const { quantity } = req.body;
  const userId = req.user.userId;

  if (!quantity || quantity < 1) {
    return res.status(400).json({ message: "Invalid quantity" });
  }

  try {
    const cart = await Cart.findOne({ userId });
    
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);
    
    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    cart.items[itemIndex].quantity = quantity;
    const updatedCart = await cart.save();
    await updatedCart.populate("items.productId");

    res.status(200).json({ message: "Item quantity updated", cart: updatedCart });
  } catch (err) {
    res.status(500).json({ message: "Failed to update item quantity", error: err.message });
  }
});

// Add item to cart
router.post("/add", auth, async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.userId;

  if (!productId || !quantity) {
    return res.status(400).json({ message: "Product ID and quantity are required" });
  }

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const existingItemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    const updatedCart = await cart.save();
    await updatedCart.populate('items.productId');

    res.status(200).json(updatedCart);
  } catch (err) {
    res.status(500).json({ message: "Failed to add item to cart", error: err.message });
  }
});

// Remove item from cart
router.delete("/remove/:itemId", auth, async (req, res) => {
  const { itemId } = req.params;
  const userId = req.user.userId;

  try {
    const updatedCart = await Cart.findOneAndUpdate(
      { userId },
      { $pull: { items: { _id: itemId } } },
      { new: true }
    ).populate("items.productId");

    if (!updatedCart) {
      return res.status(404).json({ message: "Cart not found or item not in cart" });
    }

    res.status(200).json({ message: "Item removed from cart", cart: updatedCart });
  } catch (err) {
    res.status(500).json({ message: "Failed to remove item from cart" });
  }
});

export default router;
