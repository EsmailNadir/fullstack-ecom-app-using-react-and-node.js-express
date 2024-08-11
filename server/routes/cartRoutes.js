const express = require("express");
const router = express.Router();
const Cart = require("../models/cart");
const auth = require("../middleware/auth");

console.log("Cart routes loaded");

/// Get user's cart
router.get("/:userid", auth, async (req, res) => {
  const userId = req.params.userid;
  console.log(req.params.userid); // Get userId from URL parameters
  console.log("Fetching cart for user:", userId); // Debugging line
  try {
    const cart = await Cart.findOne({ userId }).populate("items.productId");
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
  const { productId, quantity } = req.body;

  // Input validation
  if (!productId || !quantity) {
    return res
      .status(400)
      .json({ message: "Product ID and quantity are required" });
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
router.delete("/api/cart/remove/:productId", auth, async (req, res) => {
  const { productId } = req.params;

  try {
    const cart = await Cart.findOneAndUpdate(
      { userId: req.user.userId },
      { $pull: { items: { productId } } }
    );
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    res.status(204).json({ message: "Item removed from cart" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
