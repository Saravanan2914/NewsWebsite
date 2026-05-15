import { useLanguage } from '../contexts/LanguageContext';

const Footer = () => {
  useLanguage();

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8 border-t-[4px] border-primary">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Left Section */}
          <div className="space-y-4">
            <h2 className="text-3xl font-extrabold text-primary tracking-tight">GOOD NEWS</h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your trusted Tamil & English digital news platform delivering breaking news, politics, cinema, sports, technology, and live updates from Tamil Nadu, India, and around the world.
            </p>
            <p className="font-bold text-primary text-sm uppercase tracking-wider">Fast. Trusted. Unbiased.</p>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-6 border-b-2 border-primary/50 pb-2 inline-block">Categories</h3>
            <ul className="grid grid-cols-2 gap-y-3 text-sm text-gray-400">
              <li><a href="#" className="hover:text-primary transition-colors">Tamil Nadu</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">India</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">World</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Politics</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Cinema</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Sports</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Technology</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Education</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Business</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold mb-6 border-b-2 border-primary/50 pb-2 inline-block">Company</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Advertise With Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms & Conditions</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Fact Checking Policy</a></li>
            </ul>
          </div>

          {/* Connect Section */}
          <div>
            <h3 className="text-lg font-semibold mb-6 border-b-2 border-primary/50 pb-2 inline-block">Connect</h3>
            <p className="text-sm text-gray-400 leading-relaxed mb-5">
              Stay connected with GOOD NEWS for instant updates, breaking headlines, and live coverage on social media.
            </p>
            <div className="flex items-center gap-4">
              {/* Instagram */}
              <a href="#" aria-label="Instagram" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-[#E1306C] hover:text-white transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-[#E1306C]/30">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              {/* YouTube */}
              <a href="#" aria-label="YouTube" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-[#FF0000] hover:text-white transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-[#FF0000]/30">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="text-gray-500 text-sm space-y-1 text-center md:text-left">
            <p>&copy; 2026 GOOD NEWS Digital Network. All Rights Reserved.</p>
            <p>Designed, Developed & Managed by <span className="font-semibold text-gray-300">Saravanan.A</span> <span className="text-xs">( Full Stack Developer )</span></p>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-4">
            {/* Instagram */}
            <a href="#" aria-label="Instagram" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-[#E1306C] hover:text-white transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-[#E1306C]/30">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </a>
            {/* Telegram */}
            <a href="#" aria-label="Telegram" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-[#0088cc] hover:text-white transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-[#0088cc]/30">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            </a>
            {/* GitHub */}
            <a href="#" aria-label="GitHub" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-white hover:text-black transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-white/30">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.19-.35 6.5-1.5 6.5-7a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.48c0 5.46 3.3 6.61 6.49 7.02A4.8 4.8 0 0 0 9.5 19.5V22"/></svg>
            </a>
            {/* LinkedIn */}
            <a href="#" aria-label="LinkedIn" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-[#0A66C2] hover:text-white transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-[#0A66C2]/30">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
            </a>
            {/* WhatsApp */}
            <a href="#" aria-label="WhatsApp" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-[#25D366] hover:text-white transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-[#25D366]/30">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" /></svg>
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
