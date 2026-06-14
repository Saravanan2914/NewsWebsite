import { createSlice } from '@reduxjs/toolkit';

const defaultNews = [];
const persistedNews = localStorage.getItem('newsItems');
let initialNews = defaultNews;
try {
  if (persistedNews) {
    const parsed = JSON.parse(persistedNews);
    if (Array.isArray(parsed)) {
      initialNews = parsed;
    }
  }
} catch (e) {
  console.error("Failed to parse newsItems from localStorage:", e);
}

const defaultBreakingNews = [];
const persistedBreakingNews = localStorage.getItem('breakingNews');
let initialBreakingNews = defaultBreakingNews;
try {
  if (persistedBreakingNews) {
    const parsed = JSON.parse(persistedBreakingNews);
    if (Array.isArray(parsed)) {
      initialBreakingNews = parsed;
    }
  }
} catch (e) {
  console.error("Failed to parse breakingNews from localStorage:", e);
}

const initialState = {
  items: initialNews,
  breakingNews: initialBreakingNews,
  searchQuery: '',
  status: 'idle',
  error: null
};

const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {
    setNews: (state, action) => {
      let payloadItems = [];
      let isPersistent = false;

      if (action.payload && Array.isArray(action.payload)) {
        payloadItems = action.payload;
      } else if (action.payload && typeof action.payload === 'object' && Array.isArray(action.payload.items)) {
        payloadItems = action.payload.items;
        isPersistent = action.payload.isPersistent || false;
      } else {
        console.warn("setNews: payload is not formatted correctly", action.payload);
        return;
      }

      const formattedItems = payloadItems.map(item => ({
        ...item,
        id: item._id || item.id
      }));

      // If database is persistent (PostgreSQL connected), trust the server as source of truth
      if (isPersistent) {
        state.items = formattedItems;
      } else {
        // No persistent database: merge server items with local items
        // Keep locally-added items that aren't on the server yet
        if (formattedItems.length > 0) {
          const serverIds = new Set(formattedItems.map(item => String(item.id)));
          const localOnly = state.items.filter(item => !serverIds.has(String(item.id)));
          state.items = [...formattedItems, ...localOnly];
        }
        // If server returned empty and we have local items, keep local items (don't wipe)
      }
      localStorage.setItem('newsItems', JSON.stringify(state.items));
    },
    addNews: (state, action) => {
      const newItem = {
        ...action.payload,
        id: action.payload._id || action.payload.id
      };
      state.items.unshift(newItem);
      localStorage.setItem('newsItems', JSON.stringify(state.items));
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    updateBreakingNews: (state, action) => {
      state.breakingNews = action.payload;
      localStorage.setItem('breakingNews', JSON.stringify(action.payload));
    },
    addBreakingNewsItem: (state, action) => {
      state.breakingNews.push(action.payload);
      localStorage.setItem('breakingNews', JSON.stringify(state.breakingNews));
    },
    deleteBreakingNewsItem: (state, action) => {
      state.breakingNews = state.breakingNews.filter(item => String(item.id) !== String(action.payload));
      localStorage.setItem('breakingNews', JSON.stringify(state.breakingNews));
    },
    deleteNews: (state, action) => {
      state.items = state.items.filter(item => String(item.id) !== String(action.payload));
      localStorage.setItem('newsItems', JSON.stringify(state.items));
    },
    toggleBreaking: (state, action) => {
      const article = state.items.find(item => String(item.id) === String(action.payload));
      if (article) {
        article.isBreaking = !article.isBreaking;
      }
      localStorage.setItem('newsItems', JSON.stringify(state.items));
    },
    toggleTrending: (state, action) => {
      const article = state.items.find(item => String(item.id) === String(action.payload));
      if (article) {
        article.isTrending = !article.isTrending;
      }
      localStorage.setItem('newsItems', JSON.stringify(state.items));
    }
  }
});

export const { setNews, addNews, setSearchQuery, updateBreakingNews, addBreakingNewsItem, deleteBreakingNewsItem, deleteNews, toggleBreaking, toggleTrending } = newsSlice.actions;
export default newsSlice.reducer;
