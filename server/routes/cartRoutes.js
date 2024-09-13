import express from 'express'
import mongoose from 'mongoose';
const { ObjectId } = mongoose.Types;
const router = express.Router();
import Cart from '../models/cart.js';
import auth from '../middleware/auth.js';

console.log("Cart routes loaded");

/// Get user's cart
router.get("/:userid", auth, async (req, res) => {
    const userId = req.params.userid;
    console.log(req.params.userid); // Get userId from URL parameters
    console.log("Fetching cart for user:", userId); // Debugging line
    try {
      const cart = await Cart.findOne({ userId }).populate("items.productId");
      console.log(JSON.stringify(cart, null, 2));
      console.log("Cart found:", cart); // Debugging line
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }
      res.status(200).json(cart);
    } catch (err) {
      console.error("Error:", err.message); // Debugging line
      res.status(500).json({ message: err.message });
    }
});

  
// Add item to cart
router.post("/add", auth, async (req, res) => {
  console.log("Add route productId:", typeof req.body.productId, req.body.productId);
    const { productId, quantity } = req.body;
  
    // Input validation
    if (!productId || !quantity) {
      return res.status(400).json({ message: "Product ID and quantity are required" });
    }
  
    try {
      const cart = await Cart.findOneAndUpdate(
        { userId: req.user.userId },
        { $addToSet: { items: { productId, quantity } } },
        { upsert: true, new: true }
      );
      res.status(201).json(cart);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
});
// Remove item from cart
router.delete("/remove/:itemId", auth, async (req, res) => {
  const { itemId } = req.params;
  const userId = req.user.userId;

  try {
    const updatedCart = await Cart.findOneAndUpdate(
      { userId: userId },
      { $pull: { items: { _id: itemId } } },
      { new: true }
    ).populate("items.productId");;

    if (!updatedCart) {
      return res.status(404).json({ message: "Cart not found or item not in cart" });
    }

    res.status(200).json({ message: "Item removed from cart", cart: updatedCart });
  } catch (err) {
    console.error("Error removing item from cart:", err.message);
    res.status(500).json({ message: "Failed to remove item from cart" });
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
    const updatedCart = await Cart.findOneAndUpdate(
      { userId: userId, "items._id": itemId },
      { $set: { "items.$.quantity": quantity } },
      { new: true }
    ).populate("items.productId");

    if (!updatedCart) {
      return res.status(404).json({ message: "Cart not found or item not in cart" });
    }

    res.status(200).json({ message: "Item quantity updated", cart: updatedCart });
  } catch (err) {
    console.error("Error updating item quantity:", err.message);
    res.status(500).json({ message: "Failed to update item quantity" });
  }
});



export default router;
