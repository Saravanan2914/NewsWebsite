import { useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useLanguage } from '../contexts/LanguageContext';
import NewsCard from '../components/NewsCard';
import { Search, SlidersHorizontal, X } from 'lucide-react';

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { t, language } = useLanguage();
  const newsItems = useSelector((state) => state.news.items);

  const [sortBy, setSortBy] = useState('relevance');
  const [selectedCategory, setSelectedCategory] = useState('');

  const SORT_OPTIONS = [
    { value: 'relevance', label: t('mostRelevant') },
    { value: 'newest',    label: t('newestFirst')  },
    { value: 'views',     label: t('mostViewed')   },
  ];

  // Derive unique categories from news items
  const categories = useMemo(() => {
    return ['', ...new Set(newsItems.map((n) => n.category))];
  }, [newsItems]);

  // Filter & sort logic
  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    let filtered = newsItems.filter((news) => {
      const title    = (news.title || '').toLowerCase();
      const titleTa  = (news.title_ta || '').toLowerCase();
      const desc     = (news.description || '').toLowerCase();
      const descTa   = (news.description_ta || '').toLowerCase();
      const category = (news.category || '').toLowerCase();
      const matchesQuery =
        title.includes(q) || titleTa.includes(q) ||
        desc.includes(q)  || descTa.includes(q)  ||
        category.includes(q);
      const matchesCategory = !selectedCategory || news.category === selectedCategory;
      return matchesQuery && matchesCategory;
    });
    if (sortBy === 'newest') {
      filtered = [...filtered].sort((a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0));
    } else if (sortBy === 'views') {
      filtered = [...filtered].sort((a, b) => (b.views || 0) - (a.views || 0));
    }
    return filtered;
  }, [query, newsItems, sortBy, selectedCategory]);

  const handleNewSearch = (e) => {
    e.preventDefault();
    const newQ = e.target.elements['inline-search'].value.trim();
    if (newQ) setSearchParams({ q: newQ });
  };

  const resultCountLabel = results.length === 1 ? t('resultFor') : t('resultsFor');

  return (
    <div className="space-y-8">
      {/* ── Header ── */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary/90 to-primary/60 p-8 text-white shadow-xl">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/newspaper.png")' }}
        />
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2 tracking-tight">
            🔍 {t('searchResults')}
          </h1>
          <p className="text-white/80 text-sm mb-6">
            {results.length} {resultCountLabel}&nbsp;
            <span className="font-bold text-white bg-white/20 px-2 py-0.5 rounded">
              "{query}"
            </span>
          </p>

          {/* Inline search bar */}
          <form onSubmit={handleNewSearch} className="flex items-center bg-white/20 backdrop-blur rounded-full px-4 py-2 max-w-lg">
            <Search size={18} className="text-white/70 mr-3 shrink-0" />
            <input
              id="inline-search"
              name="inline-search"
              type="text"
              defaultValue={query}
              placeholder={t('refineSearch')}
              className="bg-transparent border-none outline-none flex-1 text-white placeholder-white/60 text-sm"
            />
            <button
              type="submit"
              className="ml-3 bg-white text-primary font-bold text-xs px-4 py-1.5 rounded-full hover:bg-white/90 transition-colors shrink-0"
            >
              {t('search')}
            </button>
          </form>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300">
          <SlidersHorizontal size={16} />
          <span>{t('filter')}</span>
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const catKey = cat ? cat.split(' ').map((w, i) => i === 0 ? w.toLowerCase() : w).join('') : '';
            const catLabel = cat ? (t(catKey) || cat) : t('allCategories');
            return (
              <button
                key={cat || 'all'}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                  selectedCategory === cat
                    ? 'bg-primary text-white border-primary shadow'
                    : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-primary hover:text-primary'
                }`}
              >
                {catLabel}
              </button>
            );
          })}
        </div>

        {/* Sort */}
        <div className="ml-auto flex items-center gap-2 text-sm">
          <span className="text-gray-500 dark:text-gray-400 font-medium">{t('sort')}</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Results Grid ── */}
      {results.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((news) => (
            <NewsCard key={news.id} news={news} variant="medium" />
          ))}
        </div>
      ) : (
        /* Empty state */
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-6">
            <Search size={40} className="text-gray-400 dark:text-gray-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            {t('noResultsFound')}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-sm mb-6">
            {t('noResultsDesc')} <strong>"{query}"</strong>.{' '}
            {t('tryDifferentKeywords')}
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-6 py-2.5 rounded-full hover:bg-primary/90 transition-colors"
          >
            <X size={16} /> {t('clearGoHome')}
          </Link>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
