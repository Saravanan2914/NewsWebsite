import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import NewsCard from '../components/NewsCard';
import { useLanguage } from '../contexts/LanguageContext';

const CategoryView = () => {
  const { category } = useParams();
  const categoryName = category.replace('-', ' ');
  const newsItems = useSelector((state) => state.news.items);
  const categoryNews = newsItems.filter(news => news.category.toLowerCase() === categoryName.toLowerCase());
  const { t } = useLanguage();
  
  const key = categoryName.split(' ').map((word, index) => index === 0 ? word.toLowerCase() : word).join('');

  return (
    <div className="space-y-6">
      <div className="border-b-2 border-primary inline-block pb-1">
        <h1 className="text-3xl font-bold uppercase dark:text-white">{t(key)}</h1>
      </div>
      
      {categoryNews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryNews.map(news => (
            <NewsCard key={news.id} news={news} variant="medium" />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-500 dark:text-gray-400">
          <p className="text-xl">{t('noNewsFound')}</p>
        </div>
      )}
    </div>
  );
};

export default CategoryView;
