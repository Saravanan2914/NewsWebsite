const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { bucket } = require('../config/firebase');

// Configure local uploads directory
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up local storage for multer fallback
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Helper to delete associated image file from disk or Firebase cloud storage
async function deleteImageFile(imageUrl) {
  if (!imageUrl) return;
  try {
    if (imageUrl.includes('storage.googleapis.com')) {
      if (bucket) {
        const parts = imageUrl.split('/news_media/');
        if (parts.length > 1) {
          const filename = 'news_media/' + parts[1];
          const file = bucket.file(filename);
          await file.delete();
          console.log(`Deleted Firebase cloud image: ${filename}`);
        }
      }
    } else if (imageUrl.includes('/uploads/')) {
      const parts = imageUrl.split('/uploads/');
      if (parts.length > 1) {
        const filename = parts[1];
        const filePath = path.join(__dirname, '..', 'uploads', filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log(`Deleted local image file: ${filename}`);
        }
      }
    }
  } catch (err) {
    console.error("Error deleting image file:", err.message);
  }
}

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
router.get('/inmemory-clear-expired', async (req, res) => {
  const cutoff = Date.now() - 24 * 60 * 60 * 1000;
  const initialLength = inMemoryNews.length;

  const expiredArticles = inMemoryNews.filter(item => {
    const itemTime = new Date(item.createdAt).getTime();
    return itemTime < cutoff;
  });

  for (const article of expiredArticles) {
    await deleteImageFile(article.imageUrl);
  }

  inMemoryNews = inMemoryNews.filter(item => {
    const itemTime = new Date(item.createdAt).getTime();
    return itemTime >= cutoff;
  });

  const deletedCount = initialLength - inMemoryNews.length;
  res.json({ message: `In-memory expired database cleared. Deleted ${deletedCount} articles.` });
});

// File upload endpoint (supports cloud Firebase bucket and server-local disk storage fallback)
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    const localFilePath = req.file.path;
    const filename = req.file.filename;

    if (bucket) {
      console.log("Uploading to Firebase Storage...");
      const destination = `news_media/${filename}`;

      await bucket.upload(localFilePath, {
        destination: destination,
        public: true,
        metadata: {
          contentType: req.file.mimetype,
          cacheControl: 'public, max-age=31536000',
        }
      });

      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${destination}`;

      try {
        fs.unlinkSync(localFilePath);
      } catch (err) {
        console.error("Local file cleanup error:", err);
      }

      console.log("Firebase upload successful. Public URL:", publicUrl);
      return res.json({ imageUrl: publicUrl });
    }

    console.log("Firebase not configured. Using local fallback.");
    const host = req.get('host');
    const protocol = req.protocol;
    const publicUrl = `${protocol}://${host}/uploads/${filename}`;

    console.log("Local upload successful. Public URL:", publicUrl);
    res.json({ imageUrl: publicUrl });
  } catch (error) {
    console.error("File upload error:", error);
    res.status(500).json({ message: error.message });
  }
});

// Get all news
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    let list = [...inMemoryNews];
    if (category) {
      list = list.filter(item => item.category === category);
    }
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create news
router.post('/', async (req, res) => {
  try {
    const { title, description, content, ...rest } = req.body;
    
    // Auto translate: we translate the input to both languages
    const title_en = await translateText(title, 'en');
    const title_ta = await translateText(title, 'ta');
    const description_en = await translateText(description, 'en');
    const description_ta = await translateText(description, 'ta');
    const content_en = await translateText(content, 'en');
    const content_ta = await translateText(content, 'ta');

    const savedNews = {
      _id: Date.now().toString(),
      ...rest,
      title: title_en,
      title_ta,
      description: description_en,
      description_ta,
      content: content_en,
      content_ta,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    inMemoryNews.unshift(savedNews);
    res.status(201).json(savedNews);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete news
router.delete('/:id', async (req, res) => {
  try {
    const deletedArticle = inMemoryNews.find(item => item._id === req.params.id || item.id === req.params.id);
    if (deletedArticle) {
      await deleteImageFile(deletedArticle.imageUrl);
    }
    inMemoryNews = inMemoryNews.filter(item => item._id !== req.params.id && item.id !== req.params.id);
    res.json({ message: 'News deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update news
router.put('/:id', async (req, res) => {
  try {
    const index = inMemoryNews.findIndex(item => item._id === req.params.id || item.id === req.params.id);
    if (index !== -1) {
      inMemoryNews[index] = { ...inMemoryNews[index], ...req.body, updatedAt: new Date().toISOString() };
      return res.json(inMemoryNews[index]);
    }
    res.status(404).json({ message: 'News not found' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.deleteImageFile = deleteImageFile;
module.exports = router;
