require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const path = require('path');
const newsRoutes = require('./routes/newsRoutes');
const { initDb } = require('./config/db');

// Initialize PostgreSQL database
initDb();

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Internal rewrite middleware to support dynamic SEO routing on Vercel
app.use((req, res, next) => {
  if (req.path.startsWith('/news/')) {
    const id = req.path.split('/')[2];
    req.url = `/api/news/share/${id}`;
  }
  next();
});

const uploadDir = process.env.VERCEL 
  ? path.join('/tmp', 'uploads')
  : path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadDir));

app.use('/api/news', newsRoutes);

const PORT = process.env.PORT || 5000;

// News Auto Delete Feature
// Every news post expires automatically exactly 24 hours after publication
// Note: Disabled on Vercel serverless to prevent event-loop block/hang and unnecessary resource use.
if (!process.env.VERCEL) {
  cron.schedule('*/5 * * * *', async () => {
    console.log('Running 24-hour news auto-delete task...');
    try {
      try {
        const res = await fetch(`http://127.0.0.1:${PORT}/api/news/inmemory-clear-expired`);
        const data = await res.json();
        console.log(data.message);
      } catch (fetchErr) {
        console.error("Error clearing expired in-memory news via API:", fetchErr.message);
      }
    } catch (error) {
      console.error("Error during auto-delete task:", error);
    }
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
