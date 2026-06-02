require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const path = require('path');
const newsRoutes = require('./routes/newsRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/news', newsRoutes);

// News Auto Delete Feature
// Every news post expires automatically exactly 24 hours after publication
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
