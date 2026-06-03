import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import NewsCard from '../components/NewsCard';
import { useState, useEffect, useRef } from 'react';
import {
  TrendingUp, Newspaper, Users, PlayCircle,
  ChevronLeft, ChevronRight, ArrowRight, Flame,
  Globe, Landmark, Clapperboard, Trophy, Cpu,
  GraduationCap, HeartPulse, Star, Briefcase, Tv
} from 'lucide-react';

/* ── Category icon map ── */
const CATEGORY_META = [
  { name: 'Tamil Nadu', icon: Landmark,     color: '#e60000', bg: '#fff0f0' },
  { name: 'India',      icon: Globe,        color: '#ff6b00', bg: '#fff4ed' },
  { name: 'World',      icon: Globe,        color: '#0077cc', bg: '#edf6ff' },
  { name: 'Politics',   icon: Landmark,     color: '#7c3aed', bg: '#f5f0ff' },
  { name: 'Cinema',     icon: Clapperboard, color: '#db2777', bg: '#fdf0f7' },
  { name: 'Sports',     icon: Trophy,       color: '#16a34a', bg: '#f0fdf4' },
  { name: 'Technology', icon: Cpu,          color: '#0891b2', bg: '#f0fbff' },
  { name: 'Education',  icon: GraduationCap,color: '#ca8a04', bg: '#fffbeb' },
  { name: 'Health',     icon: HeartPulse,   color: '#dc2626', bg: '#fff5f5' },
  { name: 'Astrology',  icon: Star,         color: '#9333ea', bg: '#faf5ff' },
  { name: 'Jobs',       icon: Briefcase,    color: '#0f766e', bg: '#f0fdfa' },
  { name: 'Videos',     icon: Tv,           color: '#e11d48', bg: '#fff1f2' },
];

/* ── Animated counter hook ── */
function useCounter(target, duration = 1600) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        const step = target / (duration / 16);
        let current = 0;
        const timer = setInterval(() => {
          current = Math.min(current + step, target);
          setCount(Math.floor(current));
          if (current >= target) clearInterval(timer);
        }, 16);
        observer.disconnect();
      }
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);
  return [count, ref];
}

/* ── Hero Carousel ── */
const HeroCarousel = ({ slides, language, t }) => {
  const [active, setActive] = useState(0);
  const [animating, setAnimating] = useState(false);
  const navigate = useNavigate();

  const go = (dir) => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setActive(prev => (prev + dir + slides.length) % slides.length);
      setAnimating(false);
    }, 350);
  };

  useEffect(() => {
    const timer = setInterval(() => go(1), 5500);
    return () => clearInterval(timer);
  }, [active, animating]);

  if (!slides.length) return null;
  const slide = slides[active] || slides[0];
  if (!slide) return null;
  const title = language === 'TA' && slide.title_ta ? slide.title_ta : slide.title;
  const desc  = language === 'TA' && slide.description_ta ? slide.description_ta : slide.description;

  return (
    <div className="relative w-full h-[480px] md:h-[560px] rounded-2xl overflow-hidden shadow-2xl group">
      {/* Image */}
      <img
        key={active}
        src={slide.imageUrl}
        alt={title}
        className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${animating ? 'opacity-0 scale-105' : 'opacity-100 scale-100'}`}
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

      {/* LIVE badge */}
      {slide.isBreaking && (
        <div className="absolute top-5 left-5 flex items-center gap-2 bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg animate-pulse">
          <span className="w-2 h-2 bg-white rounded-full inline-block" />
          {t('live')}
        </div>
      )}

      {/* Content */}
      <div className={`absolute bottom-0 left-0 right-0 p-6 md:p-10 transition-all duration-500 ${animating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
        <span className="inline-block bg-primary/90 text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded mb-4">
          {slide.category}
        </span>
        <h1 className="text-2xl md:text-4xl font-extrabold text-white leading-tight mb-3 drop-shadow-lg max-w-3xl">
          {title}
        </h1>
        <p className="text-gray-200 text-sm md:text-base line-clamp-2 max-w-2xl mb-5">{desc}</p>
        <div className="flex items-center gap-4">
          <Link
            to={`/news/${slide.id}`}
            className="inline-flex items-center gap-2 bg-primary text-white font-bold px-6 py-2.5 rounded-full hover:bg-primary/90 hover:scale-105 transition-all duration-200 shadow-lg"
          >
            {t('readFullStory')} <ArrowRight size={16} />
          </Link>
          <span className="text-gray-400 text-sm">{language === 'TA' && slide.uploadTime_ta ? slide.uploadTime_ta : slide.uploadTime}</span>
        </div>
      </div>

      {/* Arrows */}
      <button onClick={() => go(-1)} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-primary text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100">
        <ChevronLeft size={20} />
      </button>
      <button onClick={() => go(1)} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-primary text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100">
        <ChevronRight size={20} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 right-6 flex gap-2">
        {slides.map((_, i) => (
          <button key={i} onClick={() => { if (!animating) { setAnimating(true); setTimeout(() => { setActive(i); setAnimating(false); }, 350); } }}
            className={`h-1.5 rounded-full transition-all duration-300 ${i === active ? 'bg-primary w-8' : 'bg-white/50 w-4'}`}
          />
        ))}
      </div>
    </div>
  );
};

/* ── Stat Card ── */
const StatCard = ({ icon: Icon, label, value, suffix = '+', color }) => {
  const [count, ref] = useCounter(value);
  return (
    <div ref={ref} className="flex flex-col items-center justify-center p-5 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3" style={{ background: color + '22' }}>
        <Icon size={24} style={{ color }} />
      </div>
      <span className="text-3xl font-extrabold text-gray-900 dark:text-white">
        {count.toLocaleString()}{suffix}
      </span>
      <span className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">{label}</span>
    </div>
  );
};

/* ── Section heading ── */
const SectionHead = ({ icon: Icon, title, link, linkLabel = 'View All' }) => (
  <div className="flex items-center justify-between mb-6">
    <div className="flex items-center gap-3">
      <div className="w-1 h-8 bg-primary rounded-full" />
      {Icon && <Icon size={22} className="text-primary" />}
      <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">{title}</h2>
    </div>
    {link && (
      <Link to={link} className="flex items-center gap-1 text-primary text-sm font-semibold hover:gap-2 transition-all">
        {linkLabel} <ArrowRight size={16} />
      </Link>
    )}
  </div>
);

/* ══════════════════════════════════════════════ */
/*  MAIN HOME COMPONENT                          */
/* ══════════════════════════════════════════════ */
const Home = () => {
  const newsItems  = useSelector(state => state.news.items);
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const breakingNews = newsItems.filter(n => n.isBreaking);
  const otherNews    = newsItems.filter(n => !n.isBreaking);
  const trendingNews = newsItems.filter(n => n.isTrending);
  const videoNews    = newsItems.filter(n => n.isVideo);

  return (
    <div className="space-y-14">

      {/* ══ HERO + SIDEBAR ══ */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <HeroCarousel slides={breakingNews.length ? breakingNews : newsItems.slice(0, 3)} language={language} t={t} />
        </div>

        {/* Trending sidebar */}
        <div className="flex flex-col gap-4">
          <SectionHead icon={Flame} title={t('trendingNow')} />
          <div className="flex flex-col gap-3 flex-grow">
            {(trendingNews.length ? trendingNews : (otherNews.length ? otherNews : newsItems)).slice(0, 4).map((news, idx) => {
              const dispTitle = language === 'TA' && news.title_ta ? news.title_ta : news.title;
              return (
                <Link key={news.id} to={`/news/${news.id}`}
                  className="flex items-start gap-3 group bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-100 dark:border-gray-700 hover:shadow-md hover:border-primary/30 transition-all duration-200"
                >
                  <span className="text-3xl font-black text-primary/70 dark:text-primary/60 leading-none w-9 shrink-0 group-hover:text-primary transition-all duration-200">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-bold text-primary uppercase tracking-wider">{news.category}</span>
                    <p className="text-sm font-semibold text-gray-800 dark:text-white line-clamp-2 group-hover:text-primary transition-colors leading-snug mt-0.5">
                      {dispTitle}
                    </p>
                    <span className="text-xs text-gray-400 mt-1 block">{language === 'TA' && news.uploadTime_ta ? news.uploadTime_ta : news.uploadTime}</span>
                  </div>
                  <img src={news.imageUrl} alt="" className="w-16 h-16 rounded-lg object-cover shrink-0" />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ STATS BAR ══ */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Newspaper} label={t('articlesPublished')} value={1240}  color="#e60000" />
        <StatCard icon={Users}     label={t('dailyReaders')}      value={85000} color="#0077cc" suffix="K+" />
        <StatCard icon={TrendingUp}label={t('categoriesCovered')} value={12}    color="#16a34a" />
        <StatCard icon={PlayCircle}label={t('videoReports')}      value={320}   color="#9333ea" />
      </section>

      {/* ══ CATEGORY SPOTLIGHT ══ */}
      <section>
        <SectionHead icon={Globe} title={t('exploreCategories')} />
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {CATEGORY_META.map(({ name, icon: Icon, color, bg }) => {
            const key = name.split(' ').map((w, i) => i === 0 ? w.toLowerCase() : w).join('');
            return (
              <Link
                key={name}
                to={`/category/${name.toLowerCase().replace(' ', '-')}`}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer"
                style={{ background: bg }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: color + '22' }}>
                  <Icon size={20} style={{ color }} />
                </div>
                <span className="text-xs font-bold text-gray-700 text-center leading-tight">{t(key) || name}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ══ LATEST UPDATES (full grid) ══ */}
      <section>
        <SectionHead icon={Newspaper} title={t('latestUpdates')} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsItems.map(news => (
            <NewsCard key={news.id} news={news} variant="medium" />
          ))}
        </div>
      </section>

      {/* ══ VIDEO NEWS ══ */}
      {videoNews.length > 0 && (
        <section className="bg-gray-900 text-white p-8 rounded-2xl">
          <SectionHead icon={PlayCircle} title={t('videoNews')} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {videoNews.map(news => {
              const displayTitle = language === 'TA' && news.title_ta ? news.title_ta : news.title;
              return (
                <Link key={news.id} to={`/news/${news.id}`} className="group cursor-pointer block">
                  <div className="relative h-48 rounded-xl overflow-hidden mb-3 shadow-lg">
                    <img
                      src={news.imageUrl}
                      alt={displayTitle}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl">
                        <svg className="w-7 h-7 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M4 4l12 6-12 6z" />
                        </svg>
                      </div>
                    </div>
                    <div className="absolute top-3 left-3 bg-primary text-white text-xs font-bold px-2 py-1 rounded">
                      {news.category}
                    </div>
                    <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded">
                      {news.views} {t('viewsLabel')}
                    </div>
                  </div>
                  <h3 className="font-bold text-white line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                    {displayTitle}
                  </h3>
                  <p className="text-gray-400 text-xs mt-1">{language === 'TA' && news.uploadTime_ta ? news.uploadTime_ta : news.uploadTime}</p>
                </Link>
              );
            })}
          </div>
        </section>
      )}

    </div>
  );
};

export default Home;
