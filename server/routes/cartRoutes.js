import express from 'express';
import mongoose from 'mongoose';
const { ObjectId } = mongoose.Types;
const router = express.Router();
import Cart from '../models/cart.js';
import auth from '../middleware/auth.js';

router.use((req, res, next) => {
  console.log(`Cart route hit: ${req.method} ${req.originalUrl}`);
  console.log('Request body:', req.body);
  console.log('Request params:', req.params);
  console.log('Request query:', req.query);
  next();
});

console.log("Cart routes loaded");

// Get user's cart
router.get("/", auth, async (req, res) => {
  console.log("GET request received for cart");
  console.log("User from auth middleware:", req.user);
  
  const userId = req.user.userId;
  console.log("Fetching cart for user:", userId);

  try {
    const cart = await Cart.findOne({ userId }).populate("items.productId");
    console.log("Cart found:", JSON.stringify(cart, null, 2));
    
    if (!cart) {
      console.log(`No cart found for user ${userId}`);
      return res.status(404).json({ message: "Cart not found" });
    }
    res.status(200).json(cart);
  } catch (err) {
    console.error("Error fetching cart:", err);
    res.status(500).json({ message: err.message });
  }
});
// Update item quantity in cart
router.put("/update/:itemId", auth, async (req, res) => {
  const { itemId } = req.params;
  const { quantity } = req.body;
  const userId = req.user.userId;

  console.log(`Updating cart - UserId: ${userId}, ItemId: ${itemId}, New Quantity: ${quantity}`);

  if (!quantity || quantity < 1) {
    return res.status(400).json({ message: "Invalid quantity" });
  }

  try {
    const cart = await Cart.findOne({ userId });
    
    if (!cart) {
      console.log(`Cart not found for user ${userId}`);
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);
    
    if (itemIndex === -1) {
      console.log(`Item ${itemId} not found in cart for user ${userId}`);
      return res.status(404).json({ message: "Item not found in cart" });
    }
    // If we've reached here, both cart and item exist. Let's update.
    cart.items[itemIndex].quantity = quantity;
    const updatedCart = await cart.save();
    await updatedCart.populate("items.productId");

    console.log(`Cart updated successfully for user ${userId}`);
    res.status(200).json({ message: "Item quantity updated", cart: updatedCart });
  } catch (err) {
    console.error("Error updating item quantity:", err);
    res.status(500).json({ message: "Failed to update item quantity", error: err.message });
  }
});

  
router.post("/add", auth, async (req, res) => {
  console.log("Add route hit");
  const { productId, quantity } = req.body;
  const userId = req.user.userId;

  console.log(`Adding to cart - UserId: ${userId}, ProductId: ${productId}, Quantity: ${quantity}`);

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
      // Item exists, update quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Item doesn't exist, add new item
      cart.items.push({ productId, quantity });
    }

    const updatedCart = await cart.save();
    await updatedCart.populate('items.productId');

    console.log("Updated cart:", JSON.stringify(updatedCart, null, 2));
    res.status(200).json(updatedCart);
  } catch (err) {
    console.error("Error adding item to cart:", err);
    res.status(500).json({ message: "Failed to add item to cart", error: err.message });
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



export default router;
