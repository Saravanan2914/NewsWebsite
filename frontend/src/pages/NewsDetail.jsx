import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Clock, Eye, Link as LinkIcon } from 'lucide-react';
import NewsCard from '../components/NewsCard';
import { useLanguage } from '../contexts/LanguageContext';

const NewsDetail = () => {
  const { id } = useParams();
  const newsItems = useSelector((state) => state.news.items);
  const news = newsItems.find(n => n.id === parseInt(id));
  const relatedNews = newsItems.filter(n => n.category === news?.category && n.id !== news?.id).slice(0, 3);
  const { t, language } = useLanguage();

  if (!news) return <div className="text-center py-20">News not found</div>;

  const displayTitle = language === 'TA' && news.title_ta ? news.title_ta : news.title;
  const displayDescription = language === 'TA' && news.description_ta ? news.description_ta : news.description;
  const displayUploadTime = language === 'TA' && news.uploadTime_ta ? news.uploadTime_ta : news.uploadTime;
  const displayContent = language === 'TA' && news.content_ta ? news.content_ta : news.content;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Article */}
      <article className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <span className="bg-primary text-white text-sm font-bold px-3 py-1 rounded shadow mb-4 inline-block">
          {news.category}
        </span>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
          {displayTitle}
        </h1>
        
        <div className="flex flex-wrap items-center justify-between text-gray-500 dark:text-gray-400 text-sm mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4 mb-2 sm:mb-0">
            <span className="flex items-center"><Clock size={16} className="mr-1"/> {displayUploadTime}</span>
            <span className="flex items-center"><Eye size={16} className="mr-1"/> {news.views} {t('views')}</span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="font-semibold text-gray-700 dark:text-gray-300">{t('share')}</span>
            <button className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors">f</button>
            <button className="w-8 h-8 rounded-full bg-blue-400 text-white flex items-center justify-center hover:bg-blue-500 transition-colors">t</button>
            <button className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"><LinkIcon size={16}/></button>
          </div>
        </div>

        <div className="relative w-full h-[300px] md:h-[450px] rounded-xl overflow-hidden mb-8">
          <img src={news.imageUrl} alt={displayTitle} className="w-full h-full object-cover" />
          {news.isVideo && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4l12 6-12 6z"></path></svg>
              </div>
            </div>
          )}
        </div>

        <div className="prose dark:prose-invert max-w-none text-lg leading-relaxed text-gray-700 dark:text-gray-300" dangerouslySetInnerHTML={{ __html: displayContent || displayDescription }}>
        </div>
      </article>

      {/* Sidebar */}
      <aside className="space-y-8">
        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold mb-4 border-l-4 border-primary pl-3 dark:text-white">{t('relatedNews')}</h3>
          <div className="flex flex-col gap-4">
            {relatedNews.map(n => (
              <NewsCard key={n.id} news={n} variant="small" />
            ))}
          </div>
        </div>
        
        {/* Advertisement Placeholder */}
        <div className="bg-gray-200 dark:bg-gray-700 h-[300px] rounded-xl flex items-center justify-center text-gray-500 dark:text-gray-400 border border-gray-300 dark:border-gray-600">
          <div className="text-center">
            <p className="font-bold">{t('advertisement')}</p>
            <p className="text-sm">300 x 250</p>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default NewsDetail;
