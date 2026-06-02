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
      let payloadItems = [];
      let isPersistent = false;

      if (action.payload && Array.isArray(action.payload)) {
        payloadItems = action.payload;
      } else if (action.payload && typeof action.payload === 'object' && Array.isArray(action.payload.items)) {
        payloadItems = action.payload.items;
        isPersistent = !!action.payload.isPersistent;
      } else {
        console.warn("setNews: payload is not formatted correctly", action.payload);
        return;
      }

      const mappedItems = payloadItems.map(item => ({
        ...item,
        id: item._id || item.id
      }));

      // If backend is running without Firestore persistence (offline fallback), and it returns an empty
      // array (due to a stateless serverless container restart on Vercel), we retain non-expired local storage cache.
      if (!isPersistent && mappedItems.length === 0 && state.items.length > 0) {
        const cutoff = Date.now() - 24 * 60 * 60 * 1000;
        const validLocalItems = state.items.filter(item => {
          const itemTime = new Date(item.createdAt).getTime();
          return !isNaN(itemTime) && itemTime >= cutoff;
        });

        if (validLocalItems.length > 0) {
          state.items = validLocalItems;
          localStorage.setItem('newsItems', JSON.stringify(state.items));
          return;
        }
      }

      state.items = mappedItems;
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
