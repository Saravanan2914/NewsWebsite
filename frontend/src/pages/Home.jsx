import { useSelector } from 'react-redux';
import NewsCard from '../components/NewsCard';
import { useLanguage } from '../contexts/LanguageContext';

const Home = () => {
  const newsItems = useSelector((state) => state.news.items);
  const breakingNews = newsItems.filter(news => news.isBreaking);
  const otherNews = newsItems.filter(news => !news.isBreaking);
  const { t, language } = useLanguage();

  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Feature */}
        <div className="lg:col-span-2">
          {breakingNews.length > 0 && (
            <NewsCard news={breakingNews[0]} variant="large" />
          )}
        </div>
        {/* Side Trending */}
        <div className="flex flex-col gap-6">
          <h2 className="text-xl font-bold border-l-4 border-primary pl-3 dark:text-white">
            {t('trendingNow')}
          </h2>
          <div className="flex-grow flex flex-col gap-4">
            {otherNews.slice(0, 3).map(news => (
              <NewsCard key={news.id} news={news} variant="small" />
            ))}
          </div>
        </div>
      </section>

      {/* Grid Section */}
      <section>
        <div className="flex items-center justify-between mb-6 border-b-2 border-gray-200 dark:border-gray-800 pb-2">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white relative">
            <span className="border-b-4 border-primary absolute -bottom-[10px] left-0 w-1/2"></span>
            {t('latestUpdates')}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsItems.map(news => (
            <NewsCard key={news.id} news={news} variant="medium" />
          ))}
        </div>
      </section>
      
      {/* Video Section */}
      <section className="bg-gray-900 text-white p-6 rounded-xl -mx-4 md:mx-0">
        <div className="flex items-center justify-between mb-6 border-b border-gray-700 pb-2">
          <h2 className="text-2xl font-bold">{t('videoNews')}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {newsItems.filter(n => n.isVideo).map(news => {
            const displayTitle = language === 'TA' && news.title_ta ? news.title_ta : news.title;
            return (
              <div key={news.id} className="group cursor-pointer">
                <div className="relative h-48 rounded-lg overflow-hidden mb-3">
                  <img src={news.imageUrl} alt={displayTitle} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center">
                      <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4l12 6-12 6z"></path></svg>
                    </div>
                  </div>
                </div>
                <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">{displayTitle}</h3>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Home;
