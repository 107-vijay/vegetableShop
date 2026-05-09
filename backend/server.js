const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB URI provided by the user
// const mongoURI = "mongodb+srv://vijaym8254:Vijay@123@nitthealth.bxjbyvs.mongodb.net/nitthealth";
const mongoURI = dotenv.MONGO_URI; // Fallback to local MongoDB
mongoose.connect(mongoURI)
  .then(() => {
    console.log("MongoDB Connected");
    seedDatabase();
  })
  .catch(err => console.log("MongoDB Connection Error:", err));

// Product Schema
const ProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
  unit: String
});

const Product = mongoose.model('Product', ProductSchema);

// Order Schema
const OrderSchema = new mongoose.Schema({
  items: Array,
  total: Number,
  customerName: String,
  address: String,
  date: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', OrderSchema);

// Sample products data
const sampleProducts = [
  { name: 'Tomato', price: 40, image: '🍅', unit: 'kg' },
  { name: 'Carrot', price: 30, image: '🥕', unit: 'kg' },
  { name: 'Broccoli', price: 50, image: '🥦', unit: 'kg' },
  { name: 'Lettuce', price: 35, image: '🥬', unit: 'kg' },
  { name: 'Cucumber', price: 25, image: '🥒', unit: 'kg' },
  { name: 'Onion', price: 20, image: '🧅', unit: 'kg' },
  { name: 'Bell Pepper', price: 45, image: '🫑', unit: 'kg' },
  { name: 'Spinach', price: 40, image: '🥬', unit: 'kg' }
];

// Seed database on startup
async function seedDatabase() {
  try {
    const existingProducts = await Product.countDocuments();
    if (existingProducts === 0) {
      await Product.insertMany(sampleProducts);
      console.log('Sample products added to database');
    }
  } catch (err) {
    console.log('Error seeding database:', err.message);
  }
}

// Routes
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.status(201).json({ message: "Order placed successfully!", orderId: newOrder._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
