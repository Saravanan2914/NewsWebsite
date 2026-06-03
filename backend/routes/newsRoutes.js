const express = require('express');
const router = express.Router();
const multer = require('multer');
const { pool } = require('../config/db');

// Set up memory storage for multer (files are kept in memory to be converted to Base64)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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

// Automatic 24-hour cleanup service for expired news
async function cleanupExpiredNews() {
  if (!process.env.DATABASE_URL) return 0;
  try {
    const query = `DELETE FROM news WHERE expires_at <= NOW() RETURNING id`;
    const result = await pool.query(query);
    if (result.rowCount > 0) {
      console.log(`[PostgreSQL Cleanup] Deleted ${result.rowCount} expired articles.`);
    }
    return result.rowCount;
  } catch (err) {
    console.error("[PostgreSQL Cleanup] Error during automatic cleanup:", err.message);
    return 0;
  }
}

// Dedicated endpoint to clear all news data (useful for resets)
router.get('/inmemory-clear', async (req, res) => {
  try {
    if (process.env.DATABASE_URL) {
      await pool.query('TRUNCATE TABLE news');
      res.json({ message: "PostgreSQL database cleared successfully" });
    } else {
      res.status(400).json({ message: "No database connected." });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
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

// Direct Memory-buffer File Upload to Base64 for PostgreSQL
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    // Convert file buffer to base64 data URI
    const base64Data = req.file.buffer.toString('base64');
    const dataUrl = `data:${req.file.mimetype};base64,${base64Data}`;
    
    // We send back the data URL so the frontend can store it and send it back when creating the news
    console.log("Image converted to Base64 data URI successfully.");
    res.json({ imageUrl: dataUrl });

  } catch (error) {
    console.error("File upload endpoint error:", error);
    res.status(500).json({ message: error.message });
  }
});

// GET all active news
router.get('/', async (req, res) => {
  try {
    // Purge expired records inline so they never appear on page load
    await cleanupExpiredNews();

    const { category } = req.query;

    res.setHeader('X-Database-Persistent', process.env.DATABASE_URL ? 'true' : 'false');
    res.setHeader('Access-Control-Expose-Headers', 'X-Database-Persistent');

    if (process.env.DATABASE_URL) {
      let query = 'SELECT id, title, title_ta, description, description_ta, content, content_ta, category, image_data as "imageUrl", is_breaking as "isBreaking", is_trending as "isTrending", is_video as "isVideo", views, upload_time as "uploadTime", upload_time_ta as "uploadTime_ta", created_at as "createdAt", expires_at as "expiresAt", updated_at as "updatedAt" FROM news';
      const values = [];
      
      if (category) {
        query += ' WHERE category = $1';
        values.push(category);
      }
      
      query += ' ORDER BY created_at DESC';
      
      const result = await pool.query(query, values);
      
      // Ensure we format IDs as string for frontend compatibility if needed
      const list = result.rows.map(row => ({
        ...row,
        _id: row.id.toString(), // Add _id for frontend compatibility
        id: row.id.toString()
      }));
      
      res.json(list);
    } else {
      res.json([]); // Return empty if no DB connected
    }
  } catch (err) {
    console.error("Get news error:", err);
    res.status(500).json({ message: err.message });
  }
});

// POST: Create news (calculates createdAt and exact 24-hour expiresAt)
router.post('/', async (req, res) => {
  try {
    const { title, description, content, imageUrl, ...rest } = req.body;
    
    // Auto translate text bilingual system
    const title_en = await translateText(title, 'en');
    const title_ta = await translateText(title, 'ta');
    const description_en = await translateText(description, 'en');
    const description_ta = await translateText(description, 'ta');
    const content_en = await translateText(content, 'en');
    const content_ta = await translateText(content, 'ta');

    const createdAt = new Date();
    const expiresAt = new Date(createdAt.getTime() + 24 * 60 * 60 * 1000); // exactly 24 hours later
    const updatedAt = new Date();

    if (process.env.DATABASE_URL) {
      const insertQuery = `
        INSERT INTO news (
          title, title_ta, description, description_ta, content, content_ta, category, image_data, 
          is_breaking, is_trending, is_video, views, upload_time, upload_time_ta,
          created_at, expires_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17
        ) RETURNING *;
      `;
      const values = [
        title_en, title_ta, description_en, description_ta, content_en, content_ta, rest.category, imageUrl,
        rest.isBreaking || false, rest.isTrending || false, rest.isVideo || false, rest.views || '0', rest.uploadTime || '', rest.uploadTime_ta || '',
        createdAt, expiresAt, updatedAt
      ];
      
      const result = await pool.query(insertQuery, values);
      const savedNews = result.rows[0];
      
      const formattedResponse = {
        ...savedNews,
        imageUrl: savedNews.image_data,
        isBreaking: savedNews.is_breaking,
        isTrending: savedNews.is_trending,
        isVideo: savedNews.is_video,
        views: savedNews.views,
        uploadTime: savedNews.upload_time,
        uploadTime_ta: savedNews.upload_time_ta,
        createdAt: savedNews.created_at,
        expiresAt: savedNews.expires_at,
        updatedAt: savedNews.updated_at,
        _id: savedNews.id.toString(),
        id: savedNews.id.toString()
      };
      
      console.log(`[PostgreSQL] Saved article: ${savedNews.id}`);
      res.status(201).json(formattedResponse);
    } else {
      res.status(400).json({ message: "No database connected." });
    }
  } catch (err) {
    console.error("Create news error:", err);
    res.status(400).json({ message: err.message });
  }
});

// DELETE: News article
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    if (process.env.DATABASE_URL) {
      const deleteQuery = 'DELETE FROM news WHERE id = $1 RETURNING id';
      const result = await pool.query(deleteQuery, [id]);
      if (result.rowCount > 0) {
        res.json({ message: 'News article deleted successfully.' });
      } else {
        res.status(404).json({ message: 'News article not found.' });
      }
    } else {
       res.status(400).json({ message: "No database connected." });
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
    const updateData = req.body;
    const updatedAt = new Date();

    if (process.env.DATABASE_URL) {
      // Create dynamic SET clause
      const setKeys = [];
      const values = [];
      let paramIndex = 1;
      
      for (const [key, value] of Object.entries(updateData)) {
        if (['id', '_id', 'createdAt', 'expiresAt', 'updatedAt'].includes(key)) continue;
        
        let dbKey = key;
        if (key === 'imageUrl') dbKey = 'image_data';
        if (key === 'isBreaking') dbKey = 'is_breaking';
        if (key === 'isTrending') dbKey = 'is_trending';
        if (key === 'isVideo') dbKey = 'is_video';
        if (key === 'uploadTime') dbKey = 'upload_time';
        if (key === 'uploadTime_ta') dbKey = 'upload_time_ta';
        
        setKeys.push(`${dbKey} = $${paramIndex}`);
        values.push(value);
        paramIndex++;
      }
      
      setKeys.push(`updated_at = $${paramIndex}`);
      values.push(updatedAt);
      paramIndex++;
      
      values.push(id);
      
      const updateQuery = `
        UPDATE news
        SET ${setKeys.join(', ')}
        WHERE id = $${paramIndex - 1}
        RETURNING *;
      `;
      
      const result = await pool.query(updateQuery, values);
      if (result.rowCount > 0) {
        const updatedDoc = result.rows[0];
        const formattedResponse = {
          ...updatedDoc,
          imageUrl: updatedDoc.image_data,
          isBreaking: updatedDoc.is_breaking,
          isTrending: updatedDoc.is_trending,
          isVideo: updatedDoc.is_video,
          views: updatedDoc.views,
          uploadTime: updatedDoc.upload_time,
          uploadTime_ta: updatedDoc.upload_time_ta,
          createdAt: updatedDoc.created_at,
          expiresAt: updatedDoc.expires_at,
          updatedAt: updatedDoc.updated_at,
          _id: updatedDoc.id.toString(),
          id: updatedDoc.id.toString()
        };
        res.json(formattedResponse);
      } else {
        res.status(404).json({ message: 'News article not found.' });
      }
    } else {
      res.status(400).json({ message: "No database connected." });
    }
  } catch (err) {
    console.error("Update news error:", err);
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
