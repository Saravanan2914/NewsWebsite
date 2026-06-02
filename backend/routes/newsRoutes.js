const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { bucket, db } = require('../config/firebase');

// Set up memory storage for multer (no files written to Vercel/local disk)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Helper to delete associated image file from Firebase cloud storage
async function deleteImageFile(imageUrl) {
  if (!imageUrl || !bucket) return;
  try {
    if (imageUrl.includes('storage.googleapis.com')) {
      const parts = imageUrl.split(`/${bucket.name}/`);
      if (parts.length > 1) {
        const filename = parts[1];
        const file = bucket.file(filename);
        await file.delete();
        console.log(`Deleted Firebase cloud image: ${filename}`);
      }
    } else if (imageUrl.includes('firebasestorage.googleapis.com')) {
      // Handle alternative URL format: https://firebasestorage.googleapis.com/v0/b/<bucket-name>/o/<filename>?alt=media
      const parts = imageUrl.split('/o/');
      if (parts.length > 1) {
        const encodedFilename = parts[1].split('?')[0];
        const filename = decodeURIComponent(encodedFilename);
        const file = bucket.file(filename);
        await file.delete();
        console.log(`Deleted Firebase cloud image (encoded): ${filename}`);
      }
    }
  } catch (err) {
    console.error("Error deleting image file:", err.message);
  }
}

// In-memory fallback database for premium offline/local experience when Firebase is not configured
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

// Automatic 24-hour cleanup service for expired news and associated storage images
async function cleanupExpiredNews() {
  const now = new Date().toISOString();
  let deletedCount = 0;

  if (db) {
    try {
      const snapshot = await db.collection('news')
        .where('expiresAt', '<=', now)
        .get();

      for (const doc of snapshot.docs) {
        const article = doc.data();
        if (article.imageUrl) {
          await deleteImageFile(article.imageUrl);
        }
        await doc.ref.delete();
        deletedCount++;
      }
      if (deletedCount > 0) {
        console.log(`[Firestore Cleanup] Deleted ${deletedCount} expired articles and their media.`);
      }
    } catch (err) {
      console.error("[Firestore Cleanup] Error during automatic cleanup:", err.message);
    }
  } else {
    // In-memory fallback automatic 24-hour cleanup
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

    deletedCount = initialLength - inMemoryNews.length;
    if (deletedCount > 0) {
      console.log(`[In-Memory Cleanup] Deleted ${deletedCount} expired fallback articles.`);
    }
  }
  return deletedCount;
}

// Dedicated endpoint to clear all news data (useful for resets)
router.get('/inmemory-clear', async (req, res) => {
  if (db) {
    try {
      const snapshot = await db.collection('news').get();
      for (const doc of snapshot.docs) {
        const article = doc.data();
        if (article.imageUrl) {
          await deleteImageFile(article.imageUrl);
        }
        await doc.ref.delete();
      }
      res.json({ message: "Firestore database cleared successfully" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  } else {
    inMemoryNews = [];
    res.json({ message: "In-memory database cleared successfully" });
  }
});

// Dedicated endpoint for scheduled execution (Vercel Cron / Cloud Scheduler)
router.get('/inmemory-clear-expired', async (req, res) => {
  try {
    const deletedCount = await cleanupExpiredNews();
    res.json({ message: `Database cleanup complete. Purged ${deletedCount} expired articles.` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- TICKER ENDPOINTS ---
let inMemoryTickers = [];

// GET all tickers
router.get('/tickers', async (req, res) => {
  try {
    if (db) {
      const snapshot = await db.collection('tickers').orderBy('createdAt', 'asc').get();
      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        _id: doc.id,
        ...doc.data()
      }));
      res.json(list);
    } else {
      res.json(inMemoryTickers);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST: Add new ticker
router.post('/tickers', async (req, res) => {
  try {
    const { text, text_ta } = req.body;
    const tickerData = {
      text,
      text_ta,
      createdAt: new Date().toISOString()
    };

    if (db) {
      const docRef = await db.collection('tickers').add(tickerData);
      res.status(201).json({
        id: docRef.id,
        _id: docRef.id,
        ...tickerData
      });
    } else {
      const savedTicker = {
        id: Date.now().toString(),
        _id: Date.now().toString(),
        ...tickerData
      };
      inMemoryTickers.push(savedTicker);
      res.status(201).json(savedTicker);
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT: Update ticker
router.put('/tickers/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { text, text_ta } = req.body;

    if (db) {
      const docRef = db.collection('tickers').doc(id);
      await docRef.update({ text, text_ta, updatedAt: new Date().toISOString() });
      const updatedDoc = await docRef.get();
      res.json({
        id: updatedDoc.id,
        _id: updatedDoc.id,
        ...updatedDoc.data()
      });
    } else {
      const index = inMemoryTickers.findIndex(item => String(item.id) === String(id));
      if (index !== -1) {
        inMemoryTickers[index] = { ...inMemoryTickers[index], text, text_ta, updatedAt: new Date().toISOString() };
        res.json(inMemoryTickers[index]);
      } else {
        res.status(404).json({ message: 'Ticker not found' });
      }
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE: Ticker
router.delete('/tickers/:id', async (req, res) => {
  try {
    const id = req.params.id;
    if (db) {
      await db.collection('tickers').doc(id).delete();
      res.json({ message: 'Ticker deleted successfully from Firestore' });
    } else {
      inMemoryTickers = inMemoryTickers.filter(item => String(item.id) !== String(id));
      res.json({ message: 'Ticker deleted successfully from fallback' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Direct Memory-buffer File Upload to Firebase Storage
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    if (bucket) {
      console.log("Uploading direct memory buffer to Firebase Storage...");
      const uniqueFilename = `news_media/${Date.now()}-${Math.round(Math.random() * 1e9)}-${req.file.originalname}`;
      const file = bucket.file(uniqueFilename);

      const stream = file.createWriteStream({
        metadata: {
          contentType: req.file.mimetype,
          cacheControl: 'public, max-age=31536000',
        }
      });

      stream.on('error', (err) => {
        console.error("Firebase Storage write stream error:", err);
        res.status(500).json({ message: err.message });
      });

      stream.on('finish', async () => {
        try {
          // Make file public to allow direct download access on all devices
          await file.makePublic();
          const publicUrl = `https://storage.googleapis.com/${bucket.name}/${uniqueFilename}`;
          console.log("Firebase upload successful. Public URL:", publicUrl);
          res.json({ imageUrl: publicUrl });
        } catch (makePublicErr) {
          console.warn("Failed to makePublic (falling back to media-token URL):", makePublicErr.message);
          const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(uniqueFilename)}?alt=media`;
          res.json({ imageUrl: publicUrl });
        }
      });

      stream.end(req.file.buffer);
    } else {
      console.log("Firebase Storage not configured. Falling back to Base64 Data URL for local testing.");
      const base64Data = req.file.buffer.toString('base64');
      const dataUrl = `data:${req.file.mimetype};base64,${base64Data}`;
      res.json({ imageUrl: dataUrl });
    }
  } catch (error) {
    console.error("File upload endpoint error:", error);
    res.status(500).json({ message: error.message });
  }
});

// GET all active news (runs automatic 24-hour cleanup inline)
router.get('/', async (req, res) => {
  try {
    // Purge expired records inline so they never appear on page load
    await cleanupExpiredNews();

    const { category } = req.query;

    if (db) {
      let query = db.collection('news').orderBy('createdAt', 'desc');
      if (category) {
        query = query.where('category', '==', category);
      }
      const snapshot = await query.get();
      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        _id: doc.id,
        ...doc.data()
      }));
      res.json(list);
    } else {
      let list = [...inMemoryNews];
      if (category) {
        list = list.filter(item => item.category === category);
      }
      res.json(list);
    }
  } catch (err) {
    console.error("Get news error:", err);
    res.status(500).json({ message: err.message });
  }
});

// POST: Create news (calculates createdAt and exact 24-hour expiresAt)
router.post('/', async (req, res) => {
  try {
    const { title, description, content, ...rest } = req.body;
    
    // Auto translate text bilingual system
    const title_en = await translateText(title, 'en');
    const title_ta = await translateText(title, 'ta');
    const description_en = await translateText(description, 'en');
    const description_ta = await translateText(description, 'ta');
    const content_en = await translateText(content, 'en');
    const content_ta = await translateText(content, 'ta');

    const createdAt = new Date();
    const expiresAt = new Date(createdAt.getTime() + 24 * 60 * 60 * 1000); // exactly 24 hours later

    const newsData = {
      ...rest,
      title: title_en,
      title_ta,
      description: description_en,
      description_ta,
      content: content_en,
      content_ta,
      createdAt: createdAt.toISOString(),
      expiresAt: expiresAt.toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (db) {
      const docRef = await db.collection('news').add(newsData);
      const savedNews = {
        id: docRef.id,
        _id: docRef.id,
        ...newsData
      };
      console.log(`[Firestore] Saved article: ${docRef.id}`);
      res.status(201).json(savedNews);
    } else {
      const savedNews = {
        id: Date.now().toString(),
        _id: Date.now().toString(),
        ...newsData
      };
      inMemoryNews.unshift(savedNews);
      console.log(`[In-Memory Fallback] Saved article: ${savedNews.id}`);
      res.status(201).json(savedNews);
    }
  } catch (err) {
    console.error("Create news error:", err);
    res.status(400).json({ message: err.message });
  }
});

// DELETE: News article (purges document and associated Firebase Storage asset)
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    if (db) {
      const docRef = db.collection('news').doc(id);
      const doc = await docRef.get();
      if (doc.exists) {
        const article = doc.data();
        if (article.imageUrl) {
          await deleteImageFile(article.imageUrl);
        }
        await docRef.delete();
        res.json({ message: 'News article and media deleted from Firebase successfully.' });
      } else {
        res.status(404).json({ message: 'News article not found in Firestore.' });
      }
    } else {
      const deletedArticle = inMemoryNews.find(item => String(item._id || item.id) === String(id));
      if (deletedArticle) {
        await deleteImageFile(deletedArticle.imageUrl);
      }
      inMemoryNews = inMemoryNews.filter(item => String(item._id || item.id) !== String(id));
      res.json({ message: 'News article deleted from in-memory fallback successfully.' });
    }
  } catch (err) {
    console.error("Delete news error:", err);
    res.status(500).json({ message: err.message });
  }
});

// PUT: Update news article fields
router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const updateData = { ...req.body, updatedAt: new Date().toISOString() };

    if (db) {
      const docRef = db.collection('news').doc(id);
      const doc = await docRef.get();
      if (doc.exists) {
        await docRef.update(updateData);
        const updatedDoc = await docRef.get();
        res.json({
          id: updatedDoc.id,
          _id: updatedDoc.id,
          ...updatedDoc.data()
        });
      } else {
        res.status(404).json({ message: 'News article not found in Firestore.' });
      }
    } else {
      const index = inMemoryNews.findIndex(item => String(item._id || item.id) === String(id));
      if (index !== -1) {
        inMemoryNews[index] = { ...inMemoryNews[index], ...updateData };
        return res.json(inMemoryNews[index]);
      }
      res.status(404).json({ message: 'News article not found in-memory fallback.' });
    }
  } catch (err) {
    console.error("Update news error:", err);
    res.status(400).json({ message: err.message });
  }
});

router.deleteImageFile = deleteImageFile;
module.exports = router;
