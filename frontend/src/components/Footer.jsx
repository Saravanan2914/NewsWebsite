import { useLanguage } from '../contexts/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-primary mb-4">GOOD NEWS</h2>
            <p className="text-gray-400 text-sm">
              {t('footerAbout')}
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2 inline-block">{t('categories')}</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-primary transition-colors">{t('tamilNadu')}</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">{t('india')}</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">{t('politics')}</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">{t('cinema')}</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2 inline-block">{t('company')}</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-primary transition-colors">{t('aboutUs')}</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">{t('contactUs')}</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">{t('careers')}</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">{t('privacyPolicy')}</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2 inline-block">{t('connect')}</h3>
            <p className="text-sm text-gray-400 mb-4">{t('followUs')}</p>
            <div className="flex space-x-4">
              <a href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors">F</a>
              <a href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors">T</a>
              <a href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors">I</a>
              <a href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors">Y</a>
            </div>
          </div>
        </div>
        <div className="text-center text-gray-500 text-xs border-t border-gray-800 pt-6">
          &copy; {new Date().getFullYear()} {t('allRightsReserved')}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
