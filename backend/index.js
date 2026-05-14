require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cron = require('node-cron');
const newsRoutes = require('./routes/newsRoutes');
const News = require('./models/News');

const app = express();

app.use(cors());
app.use(express.json());

// Set up MongoDB Connection
// Note: Normally, this would use a URI from .env. We use a local DB for the assignment.
mongoose.connect('mongodb://127.0.0.1:27017/goodnews')
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("MongoDB connection error:", err));

app.use('/api/news', newsRoutes);

// Daily News Auto Delete Feature
// Every news post expires automatically at 12:00 AM daily
cron.schedule('0 0 * * *', async () => {
  console.log('Running daily news auto-delete task at 12:00 AM');
  try {
    const result = await News.deleteMany({});
    console.log(`Successfully deleted ${result.deletedCount} news articles.`);
  } catch (error) {
    console.error("Error during auto-delete task:", error);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
