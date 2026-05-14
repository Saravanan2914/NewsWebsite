import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Moon, Sun, Menu, UserCircle, Globe, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const CATEGORIES = [
  "Tamil Nadu", "India", "World", "Politics", "Cinema", 
  "Sports", "Technology", "Education", "Health", "Astrology", 
  "Spiritual", "Jobs", "Videos", "E-paper"
];

const Navbar = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { language, toggleLanguage, t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      alert(`Searching for: ${searchQuery}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-colors duration-200 shadow-sm">
      {/* Top Bar: Date, Login, Logo, Theme/Search */}
      <div className="container mx-auto px-4 py-2 flex items-center justify-between relative">
        <div className="flex items-center space-x-4">
          <Link to="/admin/login" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
            <UserCircle size={24} />
          </Link>
          <span className="hidden md:inline text-sm text-gray-500 dark:text-gray-400 font-medium">
            {currentTime.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>
        
        {!isSearchOpen ? (
          <Link to="/" className="text-3xl md:text-4xl font-extrabold text-primary tracking-tight absolute left-1/2 -translate-x-1/2">
            GOOD NEWS
          </Link>
        ) : (
          <form onSubmit={handleSearch} className="absolute left-1/2 -translate-x-1/2 w-1/2 max-w-md flex items-center bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-1">
            <Search size={18} className="text-gray-500 mr-2" />
            <input 
              type="text" 
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchPlaceholder')} 
              className="bg-transparent border-none outline-none w-full text-sm dark:text-white"
            />
            <button type="button" onClick={() => setIsSearchOpen(false)} className="text-gray-500 hover:text-primary ml-2">
              <X size={18} />
            </button>
          </form>
        )}
        
        <div className="flex items-center space-x-3 md:space-x-4 z-10">
          <button onClick={toggleLanguage} className="flex items-center text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-primary transition-colors bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
            <Globe size={16} className="mr-1" /> {language}
          </button>
          <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors hidden md:block">
            <Search size={20} />
          </button>
          <button onClick={toggleTheme} className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button className="md:hidden text-gray-600 dark:text-gray-300">
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Main Navigation Categories */}
      <div className="hidden md:block bg-primary dark:bg-primary-dark">
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-center space-x-6 overflow-x-auto py-3 no-scrollbar text-white font-medium text-sm">
            <Link to="/" className="hover:text-gray-200 whitespace-nowrap">{t('home')}</Link>
            {CATEGORIES.map(category => {
              // Create camelCase key from Category name e.g. "Tamil Nadu" -> "tamilNadu"
              const key = category.split(' ').map((word, index) => index === 0 ? word.toLowerCase() : word).join('');
              return (
                <Link 
                  key={category} 
                  to={`/category/${category.toLowerCase().replace(' ', '-')}`} 
                  className="hover:text-gray-200 whitespace-nowrap transition-colors"
                >
                  {t(key)}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Breaking News Ticker */}
      <div className="bg-gray-100 dark:bg-gray-800 text-xs py-2 border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 flex items-center">
          <span className="bg-primary text-white font-bold px-2 py-1 rounded mr-3 uppercase animate-pulse whitespace-nowrap">
            {t('breaking')}
          </span>
          <div className="overflow-hidden whitespace-nowrap flex-grow relative">
            <p className="inline-block animate-[marquee_20s_linear_infinite] dark:text-gray-300">
              🚨 {t('breakingNews1')} 🚨 {t('breakingNews2')} 🚨 {t('breakingNews3')}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
