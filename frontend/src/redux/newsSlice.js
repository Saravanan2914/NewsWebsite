import { createSlice } from '@reduxjs/toolkit';

const defaultNews = [];
const persistedNews = localStorage.getItem('newsItems');
const initialNews = persistedNews ? JSON.parse(persistedNews) : defaultNews;

const defaultBreakingNews = [];
const persistedBreakingNews = localStorage.getItem('breakingNews');
const initialBreakingNews = persistedBreakingNews ? JSON.parse(persistedBreakingNews) : defaultBreakingNews;

const initialState = {
  items: initialNews,
  breakingNews: initialBreakingNews,
  searchQuery: '',
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
};

const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {
    setNews: (state, action) => {
      if (action.payload && Array.isArray(action.payload)) {
        // Fallback: If backend returns empty array (stateless Vercel restart), keep cached localStorage news items
        if (action.payload.length === 0 && state.items.length > 0) {
          console.log("Backend empty (stateless restart). Falling back to localStorage news cache.");
          return;
        }
        state.items = action.payload.map(item => ({
          ...item,
          id: item._id || item.id
        }));
        localStorage.setItem('newsItems', JSON.stringify(state.items));
      } else {
        console.warn("setNews: payload is not an array", action.payload);
      }
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
      state.breakingNews = state.breakingNews.filter(item => item.id !== action.payload);
      localStorage.setItem('breakingNews', JSON.stringify(state.breakingNews));
    },
    deleteNews: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      localStorage.setItem('newsItems', JSON.stringify(state.items));
    },
    toggleBreaking: (state, action) => {
      const article = state.items.find(item => item.id === action.payload);
      if (article) {
        article.isBreaking = !article.isBreaking;
      }
      localStorage.setItem('newsItems', JSON.stringify(state.items));
    },
    toggleTrending: (state, action) => {
      const article = state.items.find(item => item.id === action.payload);
      if (article) {
        article.isTrending = !article.isTrending;
      }
      localStorage.setItem('newsItems', JSON.stringify(state.items));
    }
  }
});

export const { setNews, addNews, setSearchQuery, updateBreakingNews, addBreakingNewsItem, deleteBreakingNewsItem, deleteNews, toggleBreaking, toggleTrending } = newsSlice.actions;
export default newsSlice.reducer;
