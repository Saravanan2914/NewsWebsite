const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  title_ta: { type: String },
  description: { type: String, required: true },
  description_ta: { type: String },
  content: { type: String, required: true },
  content_ta: { type: String },
  category: { type: String, required: true },
  tags: [String],
  imageUrl: { type: String },
  isVideo: { type: Boolean, default: false },
  isBreaking: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('News', newsSchema);
