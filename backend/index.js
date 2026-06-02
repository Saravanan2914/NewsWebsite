require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cron = require('node-cron');
const path = require('path');
const newsRoutes = require('./routes/newsRoutes');
const News = require('./models/News');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Set up MongoDB Connection
// Note: Normally, this would use a URI from .env. We use a local DB for the assignment.
mongoose.connect('mongodb://127.0.0.1:27017/goodnews')
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("MongoDB connection error:", err));

app.use('/api/news', newsRoutes);

// News Auto Delete Feature
// Every news post expires automatically exactly 24 hours after publication
cron.schedule('*/5 * * * *', async () => {
  console.log('Running 24-hour news auto-delete task...');
  try {
    if (mongoose.connection.readyState !== 1) {
      console.log('Running 24-hour news auto-delete task via in-memory fallback.');
      try {
        const res = await fetch(`http://127.0.0.1:${PORT}/api/news/inmemory-clear-expired`);
        const data = await res.json();
        console.log(data.message);
      } catch (fetchErr) {
        console.error("Error clearing expired in-memory news via API:", fetchErr.message);
      }
      return;
    }
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
    // Find and clean up expired articles and their files
    const expiredNews = await News.find({ createdAt: { $lt: cutoff } });
    if (expiredNews.length > 0) {
      for (const article of expiredNews) {
        if (newsRoutes.deleteImageFile) {
          await newsRoutes.deleteImageFile(article.imageUrl);
        }
      }
      const result = await News.deleteMany({ createdAt: { $lt: cutoff } });
      console.log(`Successfully deleted ${result.deletedCount} expired news articles older than 24 hours.`);
    }
  } catch (error) {
    console.error("Error during auto-delete task:", error);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
