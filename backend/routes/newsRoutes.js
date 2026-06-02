const express = require('express');
const router = express.Router();
const News = require('../models/News');
const mongoose = require('mongoose');

// In-memory fallback database for premium offline/local experience when MongoDB is not running
let inMemoryNews = [];

async function translateText(text, targetLang) {
  if (!text) return text;
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url);
    const json = await res.json();
    return json[0].map(item => item[0]).join('');
  } catch (error) {
    console.error('Translation error:', error);
    return text;
  }
}

// Export the inMemoryNews reference so cron in index.js can clear it if needed
router.get('/inmemory-clear', (req, res) => {
  inMemoryNews = [];
  res.json({ message: "In-memory database cleared" });
});

// Clear expired news (older than 24 hours) from in-memory fallback
router.get('/inmemory-clear-expired', (req, res) => {
  const cutoff = Date.now() - 24 * 60 * 60 * 1000;
  const initialLength = inMemoryNews.length;
  inMemoryNews = inMemoryNews.filter(item => {
    const itemTime = new Date(item.createdAt).getTime();
    return itemTime >= cutoff;
  });
  const deletedCount = initialLength - inMemoryNews.length;
  res.json({ message: `In-memory expired database cleared. Deleted ${deletedCount} articles.` });
});

// Get all news
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    
    // Check if connected to MongoDB. Ready state 1 means connected.
    if (mongoose.connection.readyState !== 1) {
      console.log("Using in-memory fallback for GET /api/news");
      let list = [...inMemoryNews];
      if (category) {
        list = list.filter(item => item.category === category);
      }
      return res.json(list);
    }

    const query = category ? { category } : {};
    const newsList = await News.find(query).sort({ createdAt: -1 });
    res.json(newsList);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create news
router.post('/', async (req, res) => {
  try {
    const { title, description, content, ...rest } = req.body;
    
    // Auto translate: we translate the input to both languages
    // This allows the admin to write in either language and still get both.
    const title_en = await translateText(title, 'en');
    const title_ta = await translateText(title, 'ta');
    const description_en = await translateText(description, 'en');
    const description_ta = await translateText(description, 'ta');
    const content_en = await translateText(content, 'en');
    const content_ta = await translateText(content, 'ta');

    const newsData = {
      ...rest,
      title: title_en,
      title_ta,
      description: description_en,
      description_ta,
      content: content_en,
      content_ta
    };

    if (mongoose.connection.readyState !== 1) {
      console.log("Using in-memory fallback for POST /api/news");
      const savedNews = {
        _id: Date.now().toString(),
        ...newsData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      inMemoryNews.unshift(savedNews);
      return res.status(201).json(savedNews);
    }

    const news = new News(newsData);
    const savedNews = await news.save();
    res.status(201).json(savedNews);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete news
router.delete('/:id', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      console.log("Using in-memory fallback for DELETE /api/news");
      inMemoryNews = inMemoryNews.filter(item => item._id !== req.params.id && item.id !== req.params.id);
      return res.json({ message: 'News deleted (in-memory)' });
    }

    await News.findByIdAndDelete(req.params.id);
    res.json({ message: 'News deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update news
router.put('/:id', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      console.log("Using in-memory fallback for PUT /api/news");
      const index = inMemoryNews.findIndex(item => item._id === req.params.id || item.id === req.params.id);
      if (index !== -1) {
        inMemoryNews[index] = { ...inMemoryNews[index], ...req.body };
        return res.json(inMemoryNews[index]);
      }
      return res.status(404).json({ message: 'News not found' });
    }

    const updatedNews = await News.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedNews) {
      return res.status(404).json({ message: 'News not found' });
    }
    res.json(updatedNews);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
