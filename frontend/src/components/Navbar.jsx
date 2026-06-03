import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Moon, Sun, Menu, UserCircle, X, Home } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchQuery as setGlobalSearch } from '../redux/newsSlice';

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const breakingNewsItems = useSelector(state => state.news.breakingNews || []);

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
    const q = searchQuery.trim();
    if (q) {
      dispatch(setGlobalSearch(q));
      navigate(`/search?q=${encodeURIComponent(q)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-colors duration-200 shadow-sm">
      {/* Top Bar: Date, Login, Logo, Theme/Search */}
      <div className="container mx-auto px-4 py-4 md:py-5 flex items-center justify-between relative">
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors" title="Home">
            <Home size={22} />
          </Link>
          <Link to="/admin/login" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors" title="Admin Login">
            <UserCircle size={24} />
          </Link>
          <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 font-medium">
            <span>{currentTime.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            <span className="font-mono font-bold bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-primary dark:text-white tracking-widest">
              {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>
        </div>
        
        {!isSearchOpen ? (
          <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center justify-center z-10">
            <Link to="/" className="text-[17px] md:text-3xl font-extrabold text-primary tracking-tight leading-none flex items-center justify-center gap-1 md:gap-2.5">
              <img src="/logo.png" alt="GOOD NEWS Logo" className="h-7 w-7 md:h-10 md:w-10 object-contain shrink-0" />
              <span>GOOD NEWS</span>
            </Link>
            <span className="text-[7.5px] md:text-[10px] font-extrabold text-primary dark:text-primary-light bg-primary/10 dark:bg-primary/20 border border-primary/25 px-1.5 py-0.5 md:px-2.5 md:py-0.5 rounded-full tracking-wider mt-0.5 md:mt-1.5 whitespace-nowrap shadow-sm">
              V. Ramachandaran ({language === 'TA' ? 'ஆசிரியர்' : 'Editor'})
            </span>
          </div>
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
        
        <div className="flex items-center space-x-1.5 md:space-x-4 z-10">
          {/* Language Toggle (Compact Globe Icon Button) */}
          <button 
            onClick={() => setLanguage(language === 'TA' ? 'EN' : 'TA')}
            className="flex items-center space-x-1 px-1.5 py-1 md:space-x-1.5 md:px-2.5 md:py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-all border border-gray-200 dark:border-gray-700 text-[9px] md:text-[10px] font-black shadow-sm transform active:scale-95 shrink-0"
            aria-label="Toggle Language"
            title="Toggle Language"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-80 shrink-0"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            <span className="tracking-wider">{language === 'TA' ? 'TA' : 'EN'}</span>
          </button>
          <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors hidden md:block">
            <Search size={20} />
          </button>
          <button onClick={toggleTheme} className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden text-gray-600 dark:text-gray-300 hover:text-primary transition-colors shrink-0">
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
              // Create camelCase key from Category name e.g. "Tamil Nadu" -> "tamilNadu", and map "E-paper" to "epaper"
              const key = category.toLowerCase() === 'e-paper'
                ? 'epaper'
                : category.split(' ').map((word, index) => index === 0 ? word.toLowerCase() : word).join('');
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
              {breakingNewsItems.map((item, idx) => (
                <span key={item?.id || idx} className="inline-flex items-center gap-1.5 mr-10 font-medium">
                  🚨 {language === 'TA' && item?.text_ta ? item.text_ta : (item?.text || (typeof item === 'string' ? item : ''))}
                </span>
              ))}
              {breakingNewsItems.length === 0 && (
                <span className="text-gray-400 font-medium">No breaking news at this moment.</span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-55 flex justify-end md:hidden">
          {/* Backdrop */}
          <div onClick={() => setIsMobileMenuOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
          
          {/* Drawer Panel */}
          <div className="relative w-72 max-w-xs h-full bg-white dark:bg-gray-900 shadow-2xl p-6 flex flex-col z-10 border-l border-gray-100 dark:border-gray-800 transition-transform duration-300">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4 mb-6">
              <div className="flex flex-col">
                <span className="text-xl font-black text-primary leading-none">GOOD NEWS</span>
                <span className="text-[9px] font-bold text-gray-400 mt-1 uppercase">V. Ramachandaran ({language === 'TA' ? 'ஆசிரியர்' : 'Editor'})</span>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-500 hover:text-primary dark:text-gray-400">
                <X size={24} />
              </button>
            </div>
            
            {/* Search bar for mobile */}
            <form onSubmit={(e) => { handleSearch(e); setIsMobileMenuOpen(false); }} className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2 mb-6">
              <Search size={18} className="text-gray-500 mr-2 shrink-0" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchPlaceholder')} 
                className="bg-transparent border-none outline-none w-full text-xs dark:text-white"
              />
            </form>

            <nav className="flex-grow overflow-y-auto space-y-3.5 pr-2 no-scrollbar">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block font-bold text-gray-855 dark:text-white hover:text-primary transition-colors">{t('home')}</Link>
              {CATEGORIES.map(category => {
                const key = category.toLowerCase() === 'e-paper'
                  ? 'epaper'
                  : category.split(' ').map((word, index) => index === 0 ? word.toLowerCase() : word).join('');
                return (
                  <Link 
                    key={category} 
                    to={`/category/${category.toLowerCase().replace(' ', '-')}`} 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block font-semibold text-gray-600 dark:text-gray-300 hover:text-primary transition-colors text-sm"
                  >
                    {t(key)}
                  </Link>
                );
              })}
            </nav>
            
            <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs text-gray-400">
              <span>GOOD NEWS Mobile</span>
              <span>v1.0.0</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
