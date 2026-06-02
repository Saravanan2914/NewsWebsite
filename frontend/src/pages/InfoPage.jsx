import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  Building2, Mail, ShieldAlert, Award, FileText, CheckCircle2, 
  Send, Users, MapPin, Phone, HelpCircle, Briefcase, 
  TrendingUp, PlayCircle, Star, Sparkles, CheckSquare, AlertCircle
} from 'lucide-react';

const InfoPage = () => {
  const { pageKey } = useParams();
  const { t, language } = useLanguage();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pageKey]);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 5000);
  };

  // Content Data Dictionary
  const contentData = {
    // ─── ABOUT US ──────────────────────────────────────────────────────────
    'about-us': {
      title: language === 'TA' ? 'எங்களை பற்றி' : 'About Us',
      subtitle: language === 'TA' ? 'நல்ல செய்தி நெட்வொர்க் - உண்மை, வேகம், நடுநிலை' : 'GOOD NEWS Network — Fast, Trusted, Unbiased',
      icon: Building2,
      render: () => (
        <div className="space-y-12">
          {/* Hero Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-gradient-to-br from-gray-50 to-red-50/20 dark:from-gray-800/40 dark:to-primary/5 p-8 rounded-2xl border border-gray-100 dark:border-gray-700/50">
            <div className="space-y-4">
              <span className="bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                {language === 'TA' ? 'எங்கள் பணி' : 'Our Mission'}
              </span>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white leading-tight">
                {language === 'TA' ? 'நம்பகமான மற்றும் வேகமான செய்தி உலகம்' : 'Empowering Readers with Reliable, Real-Time Journalism'}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                {language === 'TA' 
                  ? 'GOOD NEWS என்பது செய்திகளை உடனுக்குடனும், முழுமையான உண்மைத்தன்மையுடனும் வழங்கும் முன்னணி டிஜிட்டல் செய்தி தளமாகும். அரசியல், சமுதாயம், தொழில்நுட்பம், மற்றும் உலக நிகழ்வுகளை எவ்வித சார்புமின்றி நடுநிலையாக வழங்குவதே எங்களின் பிரதான நோக்கமாகும்.'
                  : 'GOOD NEWS is a state-of-the-art digital news platform dedicated to bringing you the most precise, instantaneous, and authentic updates. Founded on the bedrock of journalistic integrity, we report the truth without bias or sensationalism.'
                }
              </p>
            </div>
            <div className="relative rounded-2xl overflow-hidden shadow-lg h-64 bg-gray-100">
              <img 
                src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=800" 
                alt="Newsroom"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                <div>
                  <p className="text-white font-extrabold text-lg">GOOD NEWS Network</p>
                  <p className="text-gray-300 text-xs">{language === 'TA' ? 'நேர்மையான ஊடகம்' : 'Unbiased. Real. Digital.'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Core Values */}
          <div className="space-y-6">
            <h4 className="text-xl font-bold text-gray-900 dark:text-white text-center">
              {language === 'TA' ? 'எங்கள் முக்கிய நெறிமுறைகள்' : 'Our Core Editorial Values'}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: language === 'TA' ? 'உண்மைத்தன்மை' : '100% Accuracy First',
                  desc: language === 'TA' ? 'செய்திகள் வெளியிடும் முன் பலகட்ட உண்மை சரிபார்ப்புகளுக்கு உட்படுத்தப்படுகிறது.' : 'Every fact is verified through rigorous standards prior to publication.',
                  icon: CheckCircle2,
                  color: '#e60000',
                  bg: '#fff0f0'
                },
                {
                  title: language === 'TA' ? 'சார்பற்ற நடுநிலை' : 'Absolute Unbiased Reporting',
                  desc: language === 'TA' ? 'அரசியல் அல்லது வர்த்தக சார்புகளின்றி உண்மையை மட்டுமே மக்களிடம் கொண்டு சேர்க்கிறோம்.' : 'We operate completely free of corporate, political, or advertiser influence.',
                  icon: Award,
                  color: '#0077cc',
                  bg: '#edf6ff'
                },
                {
                  title: language === 'TA' ? 'அதிவேக தகவல்கள்' : 'Real-Time News Coverage',
                  desc: language === 'TA' ? 'நிகழும் உலக மாற்றங்களை நொடிப் பொழுதில் தமிழ் மற்றும் ஆங்கிலத்தில் வழங்குகிறோம்.' : 'Delivering breaking updates from local sectors to global fronts instantly.',
                  icon: Sparkles,
                  color: '#16a34a',
                  bg: '#f0fdf4'
                }
              ].map((val, idx) => (
                <div key={idx} className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50 hover:shadow-md transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: val.bg }}>
                    <val.icon size={24} style={{ color: val.color }} />
                  </div>
                  <h5 className="font-bold text-gray-900 dark:text-white mb-2">{val.title}</h5>
                  <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed">{val.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Founder Quote */}
          <div className="relative p-8 rounded-2xl bg-gray-900 text-white overflow-hidden">
            <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-10 translate-y-10">
              <Building2 size={240} />
            </div>
            <div className="relative max-w-2xl space-y-4">
              <p className="text-lg italic font-medium leading-relaxed">
                "{language === 'TA' 
                  ? 'நம்பகமான செய்திகளை விரைவாகவும் தெளிவாகவும் வழங்குவதே எங்களின் குறிக்கோள். மக்கள் சரியான தகவல்களைப் பெறுவதை உறுதி செய்வதில் நாங்கள் என்றுமே பின்வாங்குவதில்லை.'
                  : 'Our purpose is simple: to make accurate information universally accessible and engaging in real-time, helping people build informed views on the world around them.'
                }"
              </p>
              <div>
                <p className="font-extrabold text-primary text-base">V.Ramachandran</p>
                <p className="text-gray-400 text-xs">{language === 'TA' ? 'ஆசிரியர்' : 'Editor'}</p>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // ─── CONTACT US ────────────────────────────────────────────────────────
    'contact-us': {
      title: language === 'TA' ? 'தொடர்புக்கு' : 'Contact Us',
      subtitle: language === 'TA' ? 'எங்களை தொடர்பு கொள்ள கீழே உள்ள முகவரியைப் பயன்படுத்தவும்' : 'Get in touch with our editorial office.',
      icon: Mail,
      render: () => (
        <div className="flex justify-center items-center py-10">
          <div className="bg-white dark:bg-gray-800 p-8 md:p-12 rounded-3xl border border-gray-100 dark:border-gray-700/50 shadow-xl max-w-lg w-full text-center space-y-6 transform hover:-translate-y-1 transition-all duration-300">
            <div className="w-16 h-16 rounded-full bg-green-50 dark:bg-green-900/20 text-green-600 flex items-center justify-center mx-auto shadow-md">
              <Phone size={28} className="animate-pulse" />
            </div>
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">{language === 'TA' ? 'செய்தி ஆசிரியர்' : 'EDITORIAL CONTACT'}</span>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white">
                V. Ramachandaran
              </h3>
              <p className="text-primary font-bold text-sm">
                {language === 'TA' ? 'ஆசிரியர்' : 'Editor'}
              </p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-700/30">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">{language === 'TA' ? 'தொலைபேசி எண்' : 'PHONE NUMBER'}</span>
              <a href="tel:+919092033446" className="text-2xl font-black text-gray-900 dark:text-white hover:text-primary transition-colors block tracking-wide">
                +91 9092033446
              </a>
            </div>
            <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
              {language === 'TA' 
                ? 'செய்தி குறிப்புகள், விளம்பரத் தொடர்புகள் அல்லது கருத்துக்களுக்கு ஆசிரியரைத் தொடர்பு கொள்ளவும்.'
                : 'For immediate news tips, press releases, editorial coverage, or feedback, feel free to call our lead desk.'}
            </p>
          </div>
        </div>
      )
    },

    // ─── ADVERTISE WITH US ──────────────────────────────────────────────────
    'advertise': {
      title: language === 'TA' ? 'எங்களிடம் விளம்பரம் செய்யுங்கள்' : 'Advertise With Us',
      subtitle: language === 'TA' ? 'உங்களின் நிறுவன வர்த்தகத்தை லட்சக்கணக்கான வாசகர்களிடம் கொண்டு சேர்க்கவும்' : 'Connect your brand with millions of highly engaged, bilingual digital readers.',
      icon: TrendingUp,
      render: () => (
        <div className="space-y-12">
          {/* Ad Hero */}
          <div className="bg-gradient-to-r from-red-600 to-indigo-700 text-white p-8 md:p-12 rounded-3xl text-center space-y-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl" />
            <h3 className="text-2xl md:text-4xl font-extrabold max-w-2xl mx-auto leading-tight">
              {language === 'TA' ? 'தமிழகத்தின் அதிவேக டிஜிட்டல் செய்தித் தளத்தில் விளம்பரப்படுத்துங்கள்' : 'Elevate Your Business with Premium Digital Ad Real Estate'}
            </h3>
            <p className="text-gray-100 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
              {language === 'TA' 
                ? 'GOOD NEWS தளம் மாதந்தோறும் 10 மில்லியனுக்கும் அதிகமான பக்கப் பார்வைகளைப் பெறுகிறது. உங்கள் வணிக விளம்பரங்களுக்கு சிறந்த பலனைத் தரும்.'
                : 'With over 10 million monthly page views and an active daily reader-base, our premium bilingual audience guarantees stellar returns for your advertising budget.'}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="mailto:ads@goodnews.com" className="bg-white text-gray-900 hover:bg-primary hover:text-white font-bold px-6 py-3 rounded-full text-sm shadow-lg transition-all">
                {language === 'TA' ? 'இப்போதே எங்களை அணுகவும்' : 'Download Media Kit (PDF)'}
              </a>
              <a href="#packages" className="bg-black/30 hover:bg-black/50 text-white border border-white/20 font-bold px-6 py-3 rounded-full text-sm transition-all">
                {language === 'TA' ? 'விளம்பர தொகுப்புகள்' : 'View Ad Packages'}
              </a>
            </div>
          </div>

          {/* Traffic stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: language === 'TA' ? 'மாதாந்திர வாசகர்கள்' : 'Monthly Reach', value: '1.2M+' },
              { label: language === 'TA' ? 'தினசரி பார்வைகள்' : 'Daily Impressions', value: '350K+' },
              { label: language === 'TA' ? 'சமூக வலைப்பின்னல்' : 'Social Followers', value: '450K+' },
              { label: language === 'TA' ? 'சராசரி தங்கும் நேரம்' : 'Avg. Session Duration', value: '4.8 Mins' },
            ].map((stat, idx) => (
              <div key={idx} className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm text-center">
                <span className="text-3xl font-black text-primary dark:text-primary/95 block">{stat.value}</span>
                <span className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-wider block">{stat.label}</span>
              </div>
            ))}
          </div>

          {/* packages */}
          <div id="packages" className="space-y-6">
            <h4 className="text-xl font-bold text-gray-900 dark:text-white text-center">
              {language === 'TA' ? 'விளம்பரத் திட்டங்கள் & அலகுகள்' : 'Custom Tailored Ad Units'}
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: language === 'TA' ? 'முகப்பு பேனர் விளம்பரங்கள்' : 'Homepage Banner Ads',
                  desc: language === 'TA' ? 'முக்கியமான முகப்பு பக்கத்தில் உங்களின் விளம்பரத்தை வைப்பதன் மூலம் அதிக பார்வைகள் பெறலாம்.' : 'Top of home page placement. Guaranteed views.',
                  size: 'Leaderboard (728 x 90 px / 300 x 250 px)',
                  icon: TrendingUp
                },
                {
                  title: language === 'TA' ? 'சிறப்புக் கட்டுரை விளம்பரங்கள்' : 'Sponsored Content Articles',
                  desc: language === 'TA' ? 'உங்களின் நிறுவன விவரங்களை ஒரு செய்தி போல வாசகர்களுக்கு சுவாரசியமாக வழங்குங்கள்.' : 'Bilingual editorial features written by professional copywriters.',
                  size: 'Full Length Article with backlinks',
                  icon: FileText
                },
                {
                  title: language === 'TA' ? 'வீடியோ செய்திகளில் விளம்பரம்' : 'Pre-Roll Video Ads',
                  desc: language === 'TA' ? 'எங்களின் வீடியோ செய்திகளின் துவக்கத்தில் 10-15 நொடிகள் கொண்ட உங்களின் வீடியோ விளம்பரத்தை வெளியிடலாம்.' : 'Interactive clip overlays inserted smoothly into news reels.',
                  size: '10 to 15 Sec non-skippable HD clips',
                  icon: PlayCircle
                }
              ].map((pack, idx) => (
                <div key={idx} className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="w-10 h-10 rounded-lg bg-red-50 dark:bg-primary/10 text-primary flex items-center justify-center">
                      <pack.icon size={20} />
                    </div>
                    <h5 className="font-extrabold text-gray-900 dark:text-white text-base leading-snug">{pack.title}</h5>
                    <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed">{pack.desc}</p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">{language === 'TA' ? 'பரிமாண அளவு' : 'SUPPORTED FORMATS'}</span>
                    <span className="text-xs font-semibold text-primary block mt-0.5">{pack.size}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Board */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm text-center max-w-lg mx-auto space-y-4">
            <h4 className="font-extrabold text-gray-900 dark:text-white text-lg">
              {language === 'TA' ? 'தொடர்புக்கு' : 'Direct Booking Inquiries'}
            </h4>
            <p className="text-xs text-gray-500">
              {language === 'TA' 
                ? 'உடனடியாக விளம்பரம் முன்பதிவு செய்ய அல்லது கூடுதல் சலுகைகளைப் பெற எங்களுடைய விளம்பர மேலாளரை மின்னஞ்சல் மூலம் தொடர்பு கொள்ளவும்.'
                : 'Have unique marketing goals? Contact our enterprise business solutions team to structure a customized proposal.'}
            </p>
            <a href="mailto:ads@goodnews.com" className="inline-flex items-center gap-2 bg-primary text-white font-bold px-6 py-2.5 rounded-full hover:bg-primary/95 transition-all text-xs">
              <Mail size={14} /> ads@goodnews.com
            </a>
          </div>
        </div>
      )
    },

    // ─── PRIVACY POLICY ─────────────────────────────────────────────────────
    'privacy-policy': {
      title: language === 'TA' ? 'தனியுரிமைக் கொள்கை' : 'Privacy Policy',
      subtitle: language === 'TA' ? 'நாங்கள் எவ்வாறு உங்கள் தகவல்களைப் பாதுகாக்கிறோம்' : 'How GOOD NEWS collects, uses, and secures your digital interactions.',
      icon: ShieldAlert,
      render: () => (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm space-y-6 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
          <p>
            {language === 'TA' 
              ? 'நல்ல செய்தி டிஜிட்டல் நெட்வொர்க் எப்போதுமே வாசகர்களின் தனியுரிமையை மிகவும் மதிக்கிறது. எங்கள் இணையதளத்தைப் பயன்படுத்தும் போது உங்கள் தரவுப் பாதுகாப்பு எவ்வாறு மேற்கொள்ளப்படுகிறது என்பதை கீழே விவரித்துள்ளோம்.'
              : 'At GOOD NEWS Digital, accessible from our application endpoints, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by GOOD NEWS.'
            }
          </p>
          
          <h4 className="text-lg font-bold text-gray-900 dark:text-white mt-8 border-b border-gray-100 dark:border-gray-700 pb-2">
            1. {language === 'TA' ? 'நாங்கள் சேகரிக்கும் தகவல்கள்' : 'Information We Collect'}
          </h4>
          <p>
            {language === 'TA'
              ? 'நீங்கள் எங்களின் செய்திமடலுக்கு பதிவு செய்யும் போது வழங்கும் மின்னஞ்சல் முகவரி, மற்றும் இணையப் பயன்பாட்டு புள்ளிவிவரங்கள் (IP முகவரி, உலாவி வகை) போன்ற பொதுவான தகவல்களை மட்டுமே நாங்கள் சேகரிக்கிறோம்.'
              : 'If you contact us directly, we may receive additional information about you such as your name, email address, phone number, the contents of the message and/or attachments you may send us, and any other information you may choose to provide.'
            }
          </p>

          <h4 className="text-lg font-bold text-gray-900 dark:text-white mt-6 border-b border-gray-100 dark:border-gray-700 pb-2">
            2. {language === 'TA' ? 'தகவல்கள் எவ்வாறு பயன்படுத்தப்படுகின்றன' : 'How We Use Your Information'}
          </h4>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li>{language === 'TA' ? 'எங்கள் செய்திப் பக்கங்களைச் சிறந்த முறையில் மேம்படுத்த.' : 'Provide, operate, and maintain our web layout and articles.'}</li>
            <li>{language === 'TA' ? 'வாசகர்களின் பயன்பாட்டை ஆய்வு செய்ய.' : 'Understand and analyze how you interact with categories.'}</li>
            <li>{language === 'TA' ? 'தினசரி செய்திமடல்களை அனுப்ப.' : 'Send you daily email newsletters if you voluntarily subscribe.'}</li>
            <li>{language === 'TA' ? 'தேவைப்பட்டால் உங்களைத் தொடர்பு கொள்ள.' : 'Identify security patterns or prevent fraudulent activities.'}</li>
          </ul>

          <h4 className="text-lg font-bold text-gray-900 dark:text-white mt-6 border-b border-gray-100 dark:border-gray-700 pb-2">
            3. {language === 'TA' ? 'பாதுகாப்பு நெறிமுறைகள்' : 'Data Security Protocols'}
          </h4>
          <p>
            {language === 'TA'
              ? 'உங்களின் தகவல்களைப் பாதுகாக்க உலகளாவிய SSL குறியாக்க தொழில்நுட்பங்களை நாங்கள் பயன்படுத்துகிறோம். உங்கள் அனுமதியின்றி உங்களின் தரவுகள் யாருக்கும் விற்கப்பட மாட்டாது.'
              : 'We follow standard secure server protocols. All network links are encrypted with high-grade SSL/TLS layers ensuring your data stays safe and secure in accordance with privacy laws.'
            }
          </p>
        </div>
      )
    },

    // ─── TERMS & CONDITIONS ─────────────────────────────────────────────────
    'terms-conditions': {
      title: language === 'TA' ? 'விதிமுறைகள் & நிபந்தனைகள்' : 'Terms & Conditions',
      subtitle: language === 'TA' ? 'எங்கள் இணையதளப் பயன்பாட்டு நெறிமுறைகள்' : 'The legal framework and guidelines governing our digital publications.',
      icon: FileText,
      render: () => (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm space-y-6 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
          <p>
            {language === 'TA'
              ? 'GOOD NEWS செய்தித் தளத்தைப் பயன்படுத்துவதன் மூலம், கீழே குறிப்பிடப்பட்டுள்ள அனைத்து விதிமுறைகள் மற்றும் நிபந்தனைகளை நீங்கள் முழுமையாக ஒப்புக்கொள்கிறீர்கள்.'
              : 'Welcome to GOOD NEWS. These terms and conditions outline the rules and regulations for the use of our official digital application network.'
            }
          </p>

          <h4 className="text-lg font-bold text-gray-900 dark:text-white mt-8 border-b border-gray-100 dark:border-gray-700 pb-2">
            1. {language === 'TA' ? 'பதிப்புரிமை (காப்பிரைட்)' : 'Intellectual Property Rights'}
          </h4>
          <p>
            {language === 'TA'
              ? 'இந்த இணையதளத்தில் வெளியிடப்படும் செய்திகள், படங்கள், மற்றும் வீடியோக்கள் அனைத்தும் GOOD NEWS நெட்வொர்க் அமைப்பிற்கு மட்டுமே சொந்தமானது. எங்களின் அனுமதியின்றி இவற்றை மறுபிரசுரம் செய்ய அனுமதி இல்லை.'
              : 'Unless otherwise stated, GOOD NEWS and/or its licensors own the intellectual property rights for all material on GOOD NEWS. All intellectual property rights are reserved. You must not republish, sell, or rent any of our bilingual content.'
            }
          </p>

          <h4 className="text-lg font-bold text-gray-900 dark:text-white mt-6 border-b border-gray-100 dark:border-gray-700 pb-2">
            2. {language === 'TA' ? 'தவறான பயன்பாடுகள்' : 'Prohibited Website Exploitation'}
          </h4>
          <p>
            {language === 'TA'
              ? 'விளக்கக் கருத்துப் பெட்டிகளில் அநாகரீகமான சொற்கள் அல்லது விளம்பரங்களை இடுவதும், இணையத்தள சர்வரைத் தாக்கும் செயல்களும் சட்டப்படி தண்டனைக்குரியவை.'
              : 'You are strictly restricted from publishing harmful scripts, engaging in scraping, or posting offensive commentary in our sections. Violators will face immediate blocks and potential legal actions.'
            }
          </p>

          <h4 className="text-lg font-bold text-gray-900 dark:text-white mt-6 border-b border-gray-100 dark:border-gray-700 pb-2">
            3. {language === 'TA' ? 'பொறுப்புத் துறப்பு' : 'Disclaimer of Liability'}
          </h4>
          <p>
            {language === 'TA'
              ? 'செய்திகளின் உண்மைத்தன்மையை உறுதி செய்ய எங்களின் அதிகபட்ச முயற்சிகளை மேற்கொள்கிறோம். எனினும், ஏதேனும் தவறு நேர்ந்தால் திருத்தங்களை மட்டுமே மேற்கொள்ள முடியும், நஷ்ட ஈடுகளுக்கு நாங்கள் பொறுப்பல்ல.'
              : 'While we strive to verify our uploads, we do not warrant the absolute accuracy of secondary opinions, comments, or external references. Our liability is restricted to the maximum extent permissible by law.'
            }
          </p>
        </div>
      )
    },

    // ─── FACT CHECKING POLICY ───────────────────────────────────────────────
    'fact-checking': {
      title: language === 'TA' ? 'உண்மை சரிபார்ப்பு கொள்கை' : 'Fact Checking Policy',
      subtitle: language === 'TA' ? 'நாங்கள் எவ்வாறு செய்திகளின் நம்பகத்தன்மையை உறுதி செய்கிறோம்' : 'Our operational guidelines for ensuring zero misinformation.',
      icon: CheckSquare,
      render: () => (
        <div className="space-y-12">
          {/* Hero */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-8 rounded-2xl flex flex-col md:flex-row items-center gap-6 shadow-md">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
              <CheckSquare size={32} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold leading-tight">
                {language === 'TA' ? 'பொய்ச் செய்திகளுக்கு எதிரான எங்கள் போர்!' : 'Our Ironclad Commitment to Truth'}
              </h3>
              <p className="text-gray-100 text-xs leading-relaxed">
                {language === 'TA'
                  ? 'டிஜிட்டல் உலகில் பெருகிவரும் பொய்ச் செய்திகளை முற்றிலுமாகத் தடுத்து, மக்களுக்கு 100% உண்மையான தகவல்களை வழங்குவதே எங்களின் முதன்மைக் கடமையாகும்.'
                  : 'In the era of deepfakes and clickbait, GOOD NEWS stands as a beacon of trust. We enforce multi-tiered editorial layers to weed out false reporting.'
                }
              </p>
            </div>
          </div>

          {/* Workflow steps */}
          <div className="space-y-6">
            <h4 className="text-lg font-bold text-gray-900 dark:text-white">
              {language === 'TA' ? 'உண்மை சரிபார்ப்பு படிநிலைகள்' : 'Verification Steps and Editorial Pipeline'}
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  step: '01',
                  title: language === 'TA' ? 'மூல ஆதாரங்களை சரிபார்த்தல்' : 'Primary Source Verification',
                  desc: language === 'TA' ? 'செய்தியின் மூல ஆதாரம் (அரசு அறிக்கை, நேரில் கண்ட சாட்சி) எது என்று ஆராய்ந்து உறுதி செய்வோம்.' : 'Directly verify with government officials, first-hand eye witnesses, or peer-reviewed journals.'
                },
                {
                  step: '02',
                  title: language === 'TA' ? 'பலதரப்பு விசாரணைகள்' : 'Multi-Perspective Checks',
                  desc: language === 'TA' ? 'ஒரே செய்தியைப் பலவேறு நம்பகமான ஆதாரங்கள் மூலம் மீண்டும் ஒப்பிட்டுப் பார்க்கிறோம்.' : 'Cross-reference and obtain statements from multiple opposing viewpoints to remove personal bias.'
                },
                {
                  step: '03',
                  title: language === 'TA' ? 'ஆசிரியரின் இறுதி ஒப்புதல்' : 'Bilingual Editor Sign-off',
                  desc: language === 'TA' ? 'முடிவாக, தகுதிவாய்ந்த முதன்மை ஆசிரியரின் சரிபார்ப்பிற்குப் பிறகே இணையதளத்தில் வெளியிடப்படும்.' : 'Final validation review by the Editor-in-Chief before a headline is broadcasted to the public.'
                }
              ].map((pipe, idx) => (
                <div key={idx} className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm relative overflow-hidden">
                  <span className="text-6xl font-black text-emerald-500/10 absolute right-4 top-2 select-none leading-none">{pipe.step}</span>
                  <h5 className="font-extrabold text-gray-900 dark:text-white text-sm mb-2 relative z-10">{pipe.title}</h5>
                  <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed relative z-10">{pipe.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Corrections */}
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 p-6 rounded-2xl flex items-start gap-4">
            <AlertCircle className="text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" size={20} />
            <div className="space-y-2">
              <h5 className="font-bold text-amber-900 dark:text-amber-300 text-sm">
                {language === 'TA' ? 'திருத்தங்கள் கொள்கை' : 'Corrections Policy'}
              </h5>
              <p className="text-amber-800 dark:text-amber-400 text-xs leading-relaxed">
                {language === 'TA'
                  ? 'எங்கள் கட்டுரைகளில் ஏதேனும் உண்மைப் பிழைகள் இருந்தால், உடனடியாக திருத்தம் செய்து அதைக் கட்டுரையின் இறுதியில் வாசகர்களுக்கு வெளிப்படையாகத் தெரிவிப்போம். பிழைகளைச் சுட்டிக்காட்ட support@goodnews.com என்ற முகவரிக்கு எழுதலாம்.'
                  : 'We acknowledge and immediately rectify our printing slips. If you spot a factual error in our reporting, write to correction@goodnews.com and we will issue a transparent correction mark within 24 hours.'
                }
              </p>
            </div>
          </div>
        </div>
      )
    }
  };

  const page = contentData[pageKey] || contentData['about-us'];
  const PageIcon = page.icon;

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 md:px-0 space-y-10">
      
      {/* Dynamic Header */}
      <div className="relative rounded-3xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/50 shadow-sm p-8 md:p-12 overflow-hidden flex flex-col md:flex-row items-center gap-6">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
          <PageIcon size={32} />
        </div>
        <div className="space-y-2 text-center md:text-left">
          <span className="text-xs font-bold text-primary uppercase tracking-wider block">GOOD NEWS NETWORK</span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white leading-tight">
            {page.title}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base max-w-2xl">
            {page.subtitle}
          </p>
        </div>
      </div>

      {/* Main Page Render */}
      <main className="min-h-[400px]">
        {page.render()}
      </main>

    </div>
  );
};

export default InfoPage;
