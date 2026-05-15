const express = require('express');
const router = express.Router();
const News = require('../models/News');

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

// Get all news
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
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
    await News.findByIdAndDelete(req.params.id);
    res.json({ message: 'News deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
