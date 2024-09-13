import express from 'express'
import cors from 'cors';
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import productRoutes from './routes/productRoutes.js'
import userRoutes from './routes/UserRoutes.js'
import cartRoutes from './routes/cartRoutes.js'

dotenv.config(); // Load environment variables from .env file

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5001;
console.log('server is running', PORT);

app.get("/", (_req, res) => {
  res.send("Hello, welcome to the e-commerce backend!");
});

// Use the routes
app.use("/api/products", productRoutes);
app.use("/api/users", (req, res, next) => {
  console.log(`Request to /api/users: ${req.method} ${req.url}`);
  next();
}, userRoutes);
app.use("/api/cart", cartRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
