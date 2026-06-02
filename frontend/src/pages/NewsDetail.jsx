import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Clock, Eye, Link as LinkIcon } from 'lucide-react';
import NewsCard from '../components/NewsCard';
import { useLanguage } from '../contexts/LanguageContext';

const NewsDetail = () => {
  const { id } = useParams();
  const newsItems = useSelector((state) => state.news.items);
  const news = newsItems.find(n => String(n.id) === String(id));
  const relatedNews = newsItems.filter(n => n.category === news?.category && String(n.id) !== String(news?.id)).slice(0, 3);
  const { t, language } = useLanguage();

  if (!news) return <div className="text-center py-20">{t('newsNotFound')}</div>;

  const displayTitle = language === 'TA' && news.title_ta ? news.title_ta : news.title;
  const displayDescription = language === 'TA' && news.description_ta ? news.description_ta : news.description;
  const displayUploadTime = language === 'TA' && news.uploadTime_ta ? news.uploadTime_ta : news.uploadTime;
  const displayContent = language === 'TA' && news.content_ta ? news.content_ta : news.content;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Article */}
      <article className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <span className="bg-primary text-white text-sm font-bold px-3 py-1 rounded shadow mb-4 inline-block">
          {language === 'TA' ? (() => {
            const key = news.category.split(' ').map((w, i) => i === 0 ? w.toLowerCase() : w).join('');
            return t(key) || news.category;
          })() : news.category}
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
            {/* WhatsApp */}
            <a 
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(displayTitle + '\n' + window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:bg-[#20ba5a] transition-all duration-300 shadow-md hover:shadow-[#25D366]/30 transform hover:-translate-y-0.5"
              aria-label="Share on WhatsApp"
              title="Share on WhatsApp"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="fill-white stroke-none"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.46h.005c6.56 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
            </a>
            {/* Copy Link */}
            <button 
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert(language === 'TA' ? 'செய்தி இணைப்பு நகலெடுக்கப்பட்டது!' : 'News link copied to clipboard!');
              }}
              className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300 transform hover:-translate-y-0.5 shadow-sm hover:shadow-gray-400/20"
              aria-label="Copy Link"
              title="Copy Link"
            >
              <LinkIcon size={16}/>
            </button>
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
