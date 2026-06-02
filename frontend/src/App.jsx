import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setNews } from './redux/newsSlice';
import { getApiUrl } from './utils/config';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import CategoryView from './pages/CategoryView';
import NewsDetail from './pages/NewsDetail';
import SearchResults from './pages/SearchResults';
import InfoPage from './pages/InfoPage';
import AdminLogin from './admin/Login';
import AdminDashboard from './admin/Dashboard';

// Scroll to top helper that triggers on route transition
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(getApiUrl('/api/news'));
        if (response.ok) {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const data = await response.json();
            if (Array.isArray(data)) {
              dispatch(setNews(data));
            } else {
              console.error('Fetched news data is not an array:', data);
            }
          } else {
            console.error('Fetched news is not JSON. Status:', response.status);
          }
        }
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };
    fetchNews();
  }, [dispatch]);

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="category/:category" element={<CategoryView />} />
          <Route path="news/:id" element={<NewsDetail />} />
          <Route path="search" element={<SearchResults />} />
          <Route path="info/:pageKey" element={<InfoPage />} />
        </Route>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </>
  );
}

export default App;
