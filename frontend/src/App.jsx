import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import CategoryView from './pages/CategoryView';
import NewsDetail from './pages/NewsDetail';
import AdminLogin from './admin/Login';
import AdminDashboard from './admin/Dashboard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="category/:category" element={<CategoryView />} />
        <Route path="news/:id" element={<NewsDetail />} />
      </Route>
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
    </Routes>
  );
}

export default App;
