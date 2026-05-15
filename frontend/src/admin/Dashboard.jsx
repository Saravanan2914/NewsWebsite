import { useState } from 'react';
import { Link } from 'react-router-dom';
import { UploadCloud, Image as ImageIcon, LayoutDashboard, FileText, LogOut } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addNews } from '../redux/newsSlice';
import { translateText } from '../utils/translator';

const CATEGORIES = ["Tamil Nadu", "India", "World", "Politics", "Cinema", "Sports", "Technology"];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [isBreaking, setIsBreaking] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [mediaFile, setMediaFile] = useState(null);
  const dispatch = useDispatch();
  const newsItems = useSelector(state => state.news.items);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setMediaFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setMediaFile(e.target.files[0]);
    }
  };

  const handlePublish = async () => {
    if (!title || !category || !description) return alert('Fill required fields');
    
    setIsTranslating(true);
    try {
      // In a real app, upload mediaFile to Cloudinary here
      let mediaUrl = "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&q=80&w=800";
      let isVideo = false;
      
      if (mediaFile) {
        mediaUrl = URL.createObjectURL(mediaFile);
        isVideo = mediaFile.type.startsWith('video/');
      }

      // Automatically translate inputs to English and Tamil
      const title_en = await translateText(title, 'en');
      const title_ta = await translateText(title, 'ta');
      const description_en = await translateText(description, 'en');
      const description_ta = await translateText(description, 'ta');
      const content_en = await translateText(content, 'en');
      const content_ta = await translateText(content, 'ta');
      
      const newArticle = {
        id: Date.now(),
        title: title_en,
        title_ta,
        category,
        description: description_en,
        description_ta,
        content: content_en,
        content_ta,
        isBreaking,
        imageUrl: mediaUrl,
        uploadTime: "Just now",
        uploadTime_ta: "இப்போது",
        views: "0",
        isVideo: isVideo
      };

      dispatch(addNews(newArticle));
      alert('News Published Successfully!');
      
      setTitle('');
      setCategory('');
      setDescription('');
      setContent('');
      setIsBreaking(false);
      setMediaFile(null);
    } catch (error) {
      console.error(error);
      alert('Error publishing news');
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 hidden md:flex flex-col">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-extrabold text-primary">Admin Panel</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-primary/10 text-primary' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
            <LayoutDashboard size={20} />
            <span className="font-medium">Dashboard</span>
          </button>
          <button onClick={() => setActiveTab('upload')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'upload' ? 'bg-primary/10 text-primary' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
            <UploadCloud size={20} />
            <span className="font-medium">Upload News</span>
          </button>
          <button onClick={() => setActiveTab('manage')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'manage' ? 'bg-primary/10 text-primary' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
            <FileText size={20} />
            <span className="font-medium">Manage News</span>
          </button>
        </nav>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <Link to="/" className="flex items-center justify-center space-x-2 w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
            <LogOut size={18} />
            <span>Logout</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          {activeTab === 'dashboard' && 'Analytics Overview'}
          {activeTab === 'upload' && 'Publish New Article'}
          {activeTab === 'manage' && 'Manage Articles'}
        </h1>

        {/* Mobile Tabs */}
        <div className="flex md:hidden space-x-2 mb-6 overflow-x-auto pb-2">
          <button onClick={() => setActiveTab('dashboard')} className={`px-4 py-2 rounded-lg whitespace-nowrap font-medium text-sm transition-colors ${activeTab === 'dashboard' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}>Dashboard</button>
          <button onClick={() => setActiveTab('upload')} className={`px-4 py-2 rounded-lg whitespace-nowrap font-medium text-sm transition-colors ${activeTab === 'upload' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}>Upload News</button>
          <button onClick={() => setActiveTab('manage')} className={`px-4 py-2 rounded-lg whitespace-nowrap font-medium text-sm transition-colors ${activeTab === 'manage' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}>Manage News</button>
        </div>

        {activeTab === 'upload' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 max-w-4xl">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Article Title</label>
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-primary" placeholder="Enter headline..." />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-primary">
                    <option value="">Select Category</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Short Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows="3" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-primary" placeholder="Brief summary..."></textarea>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Cover Media (Image/Video)</label>
                <div 
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('mediaUpload').click()}
                  className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors cursor-pointer ${isDragging ? 'border-primary bg-primary/5 dark:bg-primary/10' : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}
                >
                  <input type="file" id="mediaUpload" className="hidden" accept="image/jpeg, image/png, image/webp, video/mp4" onChange={handleFileChange} />
                  {mediaFile ? (
                    <div>
                      <p className="text-primary font-medium">{mediaFile.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{(mediaFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  ) : (
                    <>
                      <ImageIcon className={`mx-auto h-12 w-12 mb-3 ${isDragging ? 'text-primary' : 'text-gray-400'}`} />
                      <p className="text-gray-500 dark:text-gray-400">Drag & drop files here, or <span className="text-primary font-medium">browse</span></p>
                      <p className="text-xs text-gray-400 mt-2">Supports JPG, PNG, WEBP, MP4</p>
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Article Content</label>
                <textarea rows="10" value={content} onChange={(e) => setContent(e.target.value)} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-primary" placeholder="Write full news article here..."></textarea>
              </div>

              <div className="flex items-center space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" checked={isBreaking} onChange={(e) => setIsBreaking(e.target.checked)} className="w-5 h-5 text-primary rounded focus:ring-primary" />
                  <span className="text-gray-700 dark:text-gray-300 font-medium">Mark as Breaking News</span>
                </label>
              </div>

              <div className="flex justify-end space-x-4">
                <button type="button" className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  Preview
                </button>
                <button type="button" onClick={handlePublish} disabled={isTranslating} className={`px-6 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors shadow-md flex items-center ${isTranslating ? 'opacity-70 cursor-not-allowed' : ''}`}>
                  {isTranslating ? 'Translating & Publishing...' : 'Publish Article'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Dummy content for other tabs */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Total Views Today</h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">45,231</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Articles Published</h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{newsItems.length}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Active Users</h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">1,405</p>
            </div>
          </div>
        )}

        {activeTab === 'manage' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                  <th className="px-6 py-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Title</th>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Category</th>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Date</th>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-600 dark:text-gray-300 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {newsItems.map((news) => (
                  <tr key={news.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white line-clamp-1">{news.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-bold">{news.category}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{news.uploadTime}</td>
                    <td className="px-6 py-4 text-sm text-right space-x-3">
                      <button className="text-blue-600 hover:underline font-medium">Edit</button>
                      <button className="text-red-600 hover:underline font-medium">Delete</button>
                    </td>
                  </tr>
                ))}
                {newsItems.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                      No articles published yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
