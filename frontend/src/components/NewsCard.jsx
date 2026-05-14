import { Link } from 'react-router-dom';
import { PlayCircle, Eye, Share2, Clock } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const NewsCard = ({ news, variant = 'medium' }) => {
  const isLarge = variant === 'large';
  const isSmall = variant === 'small';
  const { t } = useLanguage();

  const categoryKey = news.category.split(' ').map((word, index) => index === 0 ? word.toLowerCase() : word).join('');

  return (
    <div className={`group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-100 dark:border-gray-700 flex ${isSmall ? 'flex-row h-32' : 'flex-col'} relative`}>
      {/* Thumbnail */}
      <div className={`relative overflow-hidden ${isLarge ? 'h-64 md:h-80' : isSmall ? 'w-1/3 h-full' : 'h-48'}`}>
        <img 
          src={news.imageUrl} 
          alt={news.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        {news.isVideo && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <PlayCircle className="text-white/80 w-12 h-12 group-hover:scale-110 transition-transform" />
          </div>
        )}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded shadow">
            {t(categoryKey)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className={`flex flex-col justify-between p-4 ${isSmall ? 'w-2/3' : 'flex-grow'}`}>
        <div>
          <Link to={`/news/${news.id}`}>
            <h3 className={`font-bold text-gray-900 dark:text-white leading-snug group-hover:text-primary transition-colors line-clamp-2 ${isLarge ? 'text-xl md:text-2xl mb-3' : isSmall ? 'text-sm mb-1' : 'text-lg mb-2'}`}>
              {news.title}
            </h3>
          </Link>
          {!isSmall && (
            <p className={`text-gray-600 dark:text-gray-400 line-clamp-2 ${isLarge ? 'text-base mb-4' : 'text-sm mb-3'}`}>
              {news.description}
            </p>
          )}
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 text-xs mt-auto">
          <div className="flex items-center space-x-3">
            <span className="flex items-center"><Clock size={14} className="mr-1"/> {news.uploadTime}</span>
            <span className="flex items-center"><Eye size={14} className="mr-1"/> {news.views}</span>
          </div>
          <button className="hover:text-primary transition-colors">
            <Share2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
