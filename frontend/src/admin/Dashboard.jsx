import { useState } from 'react';
import { Link } from 'react-router-dom';
import { UploadCloud, Image as ImageIcon, LayoutDashboard, FileText, LogOut, Eye, X, CheckCircle, AlertCircle, Loader2, Zap, Megaphone, Plus, Trash2, Edit } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addNews, updateBreakingNews, addBreakingNewsItem, deleteBreakingNewsItem, deleteNews, toggleBreaking, toggleTrending } from '../redux/newsSlice';
import { translateText } from '../utils/translator';
import { getApiUrl } from '../utils/config';

const CATEGORIES = ["Tamil Nadu", "India", "World", "Politics", "Cinema", "Sports", "Technology", "Education", "Business"];

// ─── Preview Modal ────────────────────────────────────────────────────────────
const PreviewModal = ({ data, mediaFile, onClose, onPublish, isPublishing }) => {
  const [tab, setTab] = useState('en');
  const mediaUrl = mediaFile ? URL.createObjectURL(mediaFile) : null;
  const isVideo = mediaFile?.type?.startsWith('video/');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 shrink-0">
          <div className="flex items-center space-x-3">
            <Eye size={20} className="text-primary" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Article Preview</h2>
            {data.isBreaking && (
              <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-pulse flex items-center gap-1">
                <Zap size={10} /> BREAKING
              </span>
            )}
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors">
            <X size={22} />
          </button>
        </div>

        {/* Language Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 shrink-0">
          <button onClick={() => setTab('en')} className={`flex-1 py-3 text-sm font-semibold transition-colors ${tab === 'en' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>
            English Preview
          </button>
          <button onClick={() => setTab('ta')} className={`flex-1 py-3 text-sm font-semibold transition-colors ${tab === 'ta' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>
            தமிழ் Preview
          </button>
        </div>

        {/* Article Content */}
        <div className="overflow-y-auto p-6 space-y-4 flex-1">
          <span className="inline-block bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
            {data.category}
          </span>

          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white leading-tight">
            {tab === 'en' ? data.title : data.title_ta}
          </h1>

          {mediaUrl && (
            <div className="rounded-xl overflow-hidden w-full max-h-72 bg-gray-100">
              {isVideo
                ? <video src={mediaUrl} controls className="w-full max-h-72 object-cover" />
                : <img src={mediaUrl} alt="cover" className="w-full max-h-72 object-cover" />
              }
            </div>
          )}

          {!mediaUrl && (
            <div className="rounded-xl w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
              <ImageIcon size={48} className="text-gray-400" />
            </div>
          )}

          <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed border-l-4 border-primary pl-4 italic">
            {tab === 'en' ? data.description : data.description_ta}
          </p>

          {(data.content || data.content_ta) && (
            <div className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
              {tab === 'en' ? data.content : data.content_ta}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700 shrink-0 bg-gray-50 dark:bg-gray-800/50">
          <button onClick={onClose} className="px-5 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm font-medium">
            Back to Edit
          </button>
          <button
            onClick={onPublish}
            disabled={isPublishing}
            className={`px-6 py-2 bg-primary text-white font-semibold rounded-lg transition-colors shadow-md flex items-center gap-2 text-sm ${isPublishing ? 'opacity-70 cursor-not-allowed' : 'hover:bg-primary/90'}`}
          >
            {isPublishing
              ? <><Loader2 size={16} className="animate-spin" /> Publishing...</>
              : <><UploadCloud size={16} /> Confirm &amp; Publish</>
            }
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Dashboard ────────────────────────────────────────────────────────────────
const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [isBreaking, setIsBreaking] = useState(false);
  const [isTrending, setIsTrending] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [mediaFile, setMediaFile] = useState(null);

  const [isTranslating, setIsTranslating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [toast, setToast] = useState(null);

  const dispatch = useDispatch();
  const newsItems = useSelector(state => state.news.items);
  const breakingNewsItems = useSelector(state => state.news.breakingNews || []);

  // Ticker state
  const [tickerInput, setTickerInput] = useState('');
  const [editingTickerId, setEditingTickerId] = useState(null);
  const [editingTickerText, setEditingTickerText] = useState('');
  const [editingTickerTextTa, setEditingTickerTextTa] = useState('');
  const [isTickerTranslating, setIsTickerTranslating] = useState(false);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  // Ticker Handlers
  const handleAddTickerItem = async (e) => {
    e.preventDefault();
    if (!tickerInput.trim()) return showToast('error', 'Ticker text is required.');
    setIsTickerTranslating(true);
    let textEn = tickerInput;
    let textTa = tickerInput;
    try {
      textEn = await translateText(tickerInput, 'en').catch(() => tickerInput);
      textTa = await translateText(tickerInput, 'ta').catch(() => tickerInput);
    } catch (err) {
      console.error("Translation error:", err);
    }

    try {
      const response = await fetch(getApiUrl('/api/news/ticker'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textEn, text_ta: textTa })
      });
      
      if (response.ok) {
        const savedItem = await response.json();
        dispatch(addBreakingNewsItem(savedItem));
        setTickerInput('');
        showToast('success', 'Added breaking news ticker item!');
      } else {
        showToast('error', 'Failed to add ticker item.');
      }
    } catch (err) {
      console.error(err);
      showToast('error', 'Failed to add ticker item.');
    } finally {
      setIsTickerTranslating(false);
    }
  };

  const handleStartEditTicker = (item) => {
    setEditingTickerId(item.id);
    setEditingTickerText(item.text);
    setEditingTickerTextTa(item.text_ta);
  };

  const handleCancelEditTicker = () => {
    setEditingTickerId(null);
    setEditingTickerText('');
    setEditingTickerTextTa('');
  };

  const handleSaveEditTicker = async (id) => {
    if (!editingTickerText.trim()) return showToast('error', 'Text cannot be empty.');
    setIsTickerTranslating(true);
    try {
      const textEn = await translateText(editingTickerText, 'en').catch(() => editingTickerText);
      const textTa = editingTickerTextTa.trim() 
        ? editingTickerTextTa 
        : await translateText(editingTickerText, 'ta').catch(() => editingTickerText);
      
      const response = await fetch(getApiUrl(`/api/news/ticker/${id}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textEn, text_ta: textTa })
      });

      if (response.ok) {
        const updatedItem = await response.json();
        const updatedList = breakingNewsItems.map(item => {
          if (String(item.id) === String(id)) {
            return updatedItem;
          }
          return item;
        });
        dispatch(updateBreakingNews(updatedList));
        handleCancelEditTicker();
        showToast('success', 'Updated ticker item!');
      } else {
        showToast('error', 'Failed to update ticker item.');
      }
    } catch (err) {
      console.error(err);
      showToast('error', 'Failed to save edits.');
    } finally {
      setIsTickerTranslating(false);
    }
  };

  const handleDeleteTicker = async (id) => {
    try {
      const response = await fetch(getApiUrl(`/api/news/ticker/${id}`), {
        method: 'DELETE'
      });
      if (response.ok) {
        dispatch(deleteBreakingNewsItem(id));
        showToast('success', 'Deleted ticker item!');
      } else {
        showToast('error', 'Failed to delete ticker item.');
      }
    } catch (err) {
      console.error(err);
      showToast('error', 'Failed to delete ticker item.');
    }
  };

  const validate = () => {
    if (!title.trim()) return 'Article title is required.';
    if (!category) return 'Please select a category.';
    if (!description.trim()) return 'Short description is required.';
    return null;
  };

  const handlePreview = async () => {
    const err = validate();
    if (err) return showToast('error', err);

    setIsTranslating(true);
    try {
      const [title_en, title_ta, description_en, description_ta, content_en, content_ta] = await Promise.all([
        translateText(title, 'en'),
        translateText(title, 'ta'),
        translateText(description, 'en'),
        translateText(description, 'ta'),
        content ? translateText(content, 'en') : Promise.resolve(''),
        content ? translateText(content, 'ta') : Promise.resolve(''),
      ]);

      setPreviewData({ title: title_en, title_ta, category, description: description_en, description_ta, content: content_en, content_ta, isBreaking, isTrending });
      setShowPreview(true);
    } catch (e) {
      console.error(e);
      showToast('error', 'Translation failed. Check your internet connection.');
    } finally {
      setIsTranslating(false);
    }
  };

  const handlePublish = async () => {
    if (!previewData) return;
    setIsPublishing(true);
    try {
      let mediaUrl = 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&q=80&w=800';
      let isVideo = false;

      if (mediaFile) {
        const formData = new FormData();
        formData.append('file', mediaFile);

        const uploadRes = await fetch(getApiUrl('/api/news/upload'), {
          method: 'POST',
          body: formData
        });

        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          mediaUrl = uploadData.imageUrl;
          isVideo = mediaFile.type.startsWith('video/');
        } else {
          console.error('Failed to upload media. Using fallback.');
        }
      }

      const newArticle = {
        ...previewData,
        imageUrl: mediaUrl,
        isVideo,
        uploadTime: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
        uploadTime_ta: 'இப்போது',
        views: '0',
      };

      const response = await fetch(getApiUrl('/api/news'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newArticle),
      });

      if (response.ok) {
        const savedNews = await response.json();
        dispatch(addNews(savedNews));
        setShowPreview(false);
        setTitle(''); setCategory(''); setDescription(''); setContent('');
        setIsBreaking(false); setIsTrending(false); setMediaFile(null); setPreviewData(null);
        showToast('success', `"${savedNews.title || savedNews.title_ta}" published in EN & Tamil!`);
      } else {
        showToast('error', 'Publishing failed. Backend returned an error.');
      }
    } catch (e) {
      console.error(e);
      showToast('error', 'Publishing failed. Please try again.');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e) => {
    e.preventDefault(); setIsDragging(false);
    if (e.dataTransfer.files?.[0]) setMediaFile(e.dataTransfer.files[0]);
  };
  const handleFileChange = (e) => { if (e.target.files?.[0]) setMediaFile(e.target.files[0]); };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-xl text-white text-sm font-medium ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          {toast.msg}
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && previewData && (
        <PreviewModal
          data={previewData}
          mediaFile={mediaFile}
          onClose={() => setShowPreview(false)}
          onPublish={handlePublish}
          isPublishing={isPublishing}
        />
      )}

      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 hidden md:flex flex-col">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-extrabold text-primary">Admin Panel</h2>
          <p className="text-xs text-gray-400 mt-1">GOOD NEWS Network</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-primary/10 text-primary' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
            <LayoutDashboard size={20} /><span className="font-medium">Dashboard</span>
          </button>
          <button onClick={() => setActiveTab('upload')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'upload' ? 'bg-primary/10 text-primary' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
            <UploadCloud size={20} /><span className="font-medium">Upload News</span>
          </button>
          <button onClick={() => setActiveTab('manage')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'manage' ? 'bg-primary/10 text-primary' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
            <FileText size={20} /><span className="font-medium">Manage News</span>
          </button>
          <button onClick={() => setActiveTab('ticker')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'ticker' ? 'bg-primary/10 text-primary' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
            <Megaphone size={20} /><span className="font-medium">Manage Ticker</span>
          </button>
        </nav>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <Link to="/" className="flex items-center justify-center space-x-2 w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
            <LogOut size={18} /><span>Logout</span>
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          {activeTab === 'dashboard' && 'Analytics Overview'}
          {activeTab === 'upload' && 'Publish New Article'}
          {activeTab === 'manage' && 'Manage Articles'}
          {activeTab === 'ticker' && 'Manage Breaking News Ticker'}
        </h1>

        {/* Mobile Tabs */}
        <div className="flex md:hidden space-x-2 mb-6 overflow-x-auto pb-2">
          <button onClick={() => setActiveTab('dashboard')} className={`px-4 py-2 rounded-lg whitespace-nowrap font-medium text-sm transition-colors ${activeTab === 'dashboard' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}>Dashboard</button>
          <button onClick={() => setActiveTab('upload')} className={`px-4 py-2 rounded-lg whitespace-nowrap font-medium text-sm transition-colors ${activeTab === 'upload' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}>Upload News</button>
          <button onClick={() => setActiveTab('manage')} className={`px-4 py-2 rounded-lg whitespace-nowrap font-medium text-sm transition-colors ${activeTab === 'manage' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}>Manage News</button>
          <button onClick={() => setActiveTab('ticker')} className={`px-4 py-2 rounded-lg whitespace-nowrap font-medium text-sm transition-colors ${activeTab === 'ticker' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}>Manage Ticker</button>
        </div>

        {/* Upload Tab */}
        {activeTab === 'upload' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 max-w-4xl">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 flex items-center gap-2">
              <Zap size={14} className="text-primary" />
              Content will be <span className="font-semibold text-primary">auto-translated to English &amp; Tamil</span> when you click Preview.
            </p>
            <form className="space-y-6" onSubmit={e => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Article Title <span className="text-red-500">*</span></label>
                  <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-primary" placeholder="Enter headline..." />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category <span className="text-red-500">*</span></label>
                  <select value={category} onChange={e => setCategory(e.target.value)} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-primary">
                    <option value="">Select Category</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Short Description <span className="text-red-500">*</span></label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} rows="3" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-primary" placeholder="Brief summary..." />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Cover Media (Image / Video)</label>
                <div
                  onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
                  onClick={() => document.getElementById('mediaUpload').click()}
                  className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors cursor-pointer ${isDragging ? 'border-primary bg-primary/5' : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}
                >
                  <input type="file" id="mediaUpload" className="hidden" accept="image/jpeg,image/png,image/webp,video/mp4" onChange={handleFileChange} />
                  {mediaFile ? (
                    <div className="flex flex-col items-center gap-2">
                      {mediaFile.type.startsWith('image/') && (
                        <img src={URL.createObjectURL(mediaFile)} alt="preview" className="h-32 rounded-lg object-cover mx-auto" />
                      )}
                      <p className="text-primary font-medium">{mediaFile.name}</p>
                      <p className="text-xs text-gray-500">
                        {(mediaFile.size / 1024 / 1024).toFixed(2)} MB
                        <button type="button" onClick={e => { e.stopPropagation(); setMediaFile(null); }} className="ml-3 text-red-500 hover:underline">Remove</button>
                      </p>
                    </div>
                  ) : (
                    <>
                      <ImageIcon className={`mx-auto h-12 w-12 mb-3 ${isDragging ? 'text-primary' : 'text-gray-400'}`} />
                      <p className="text-gray-500 dark:text-gray-400">Drag &amp; drop files here, or <span className="text-primary font-medium">browse</span></p>
                      <p className="text-xs text-gray-400 mt-2">Supports JPG, PNG, WEBP, MP4</p>
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Article Content</label>
                <textarea rows="10" value={content} onChange={e => setContent(e.target.value)} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-primary" placeholder="Write full news article here..." />
              </div>

              <div className="flex flex-col md:flex-row md:items-center gap-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" checked={isBreaking} onChange={e => setIsBreaking(e.target.checked)} className="w-5 h-5 text-primary rounded focus:ring-primary" />
                  <span className="text-gray-700 dark:text-gray-300 font-medium">Mark as Breaking News</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" checked={isTrending} onChange={e => setIsTrending(e.target.checked)} className="w-5 h-5 text-primary rounded focus:ring-primary" />
                  <span className="text-gray-700 dark:text-gray-300 font-medium">Mark as Trending News</span>
                </label>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handlePreview}
                  disabled={isTranslating}
                  className={`px-6 py-2 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary hover:text-white transition-colors flex items-center gap-2 ${isTranslating ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  {isTranslating
                    ? <><Loader2 size={16} className="animate-spin" /> Translating...</>
                    : <><Eye size={16} /> Preview Article</>
                  }
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Dashboard Tab */}
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

        {/* Manage Tab */}
        {activeTab === 'manage' && (
          <div className="space-y-4">
            {/* Desktop Table View */}
            <div className="hidden md:block bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                    <th className="px-6 py-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Title</th>
                    <th className="px-6 py-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Category</th>
                    <th className="px-6 py-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Breaking News</th>
                    <th className="px-6 py-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Trending Now</th>
                    <th className="px-6 py-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Published</th>
                    <th className="px-6 py-3 text-sm font-semibold text-gray-600 dark:text-gray-300 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {newsItems.map(news => (
                    <tr key={news.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white line-clamp-1 max-w-xs">{news.title}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        <span className="bg-primary/10 text-primary px-2.5 py-1 rounded-full text-xs font-bold">{news.category}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        <button
                          onClick={async () => {
                            try {
                              const response = await fetch(getApiUrl(`/api/news/${news.id}`), {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ isBreaking: !news.isBreaking })
                              });
                              if (response.ok) {
                                dispatch(toggleBreaking(news.id));
                                showToast('success', `Toggled Breaking status for "${news.title}"`);
                              } else {
                                showToast('error', 'Failed to update article status.');
                              }
                            } catch (err) {
                              console.error(err);
                              showToast('error', 'Network error.');
                            }
                          }}
                          className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                            news.isBreaking
                              ? 'bg-red-600 text-white shadow-sm'
                              : 'bg-gray-100 hover:bg-gray-200 text-gray-500 dark:bg-gray-800 dark:hover:bg-gray-700'
                          }`}
                        >
                          {news.isBreaking ? 'Breaking ⚡' : 'Set Breaking'}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        <button
                          onClick={async () => {
                            try {
                              const response = await fetch(getApiUrl(`/api/news/${news.id}`), {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ isTrending: !news.isTrending })
                              });
                              if (response.ok) {
                                dispatch(toggleTrending(news.id));
                                showToast('success', `Toggled Trending status for "${news.title}"`);
                              } else {
                                showToast('error', 'Failed to update article status.');
                              }
                            } catch (err) {
                              console.error(err);
                              showToast('error', 'Network error.');
                            }
                          }}
                          className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                            news.isTrending
                              ? 'bg-amber-500 text-white shadow-sm'
                              : 'bg-gray-100 hover:bg-gray-200 text-gray-500 dark:bg-gray-800 dark:hover:bg-gray-700'
                          }`}
                        >
                          {news.isTrending ? 'Trending 🔥' : 'Set Trending'}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{news.uploadTime}</td>
                      <td className="px-6 py-4 text-sm text-right space-x-3">
                        <button 
                          onClick={async () => {
                            try {
                              const response = await fetch(getApiUrl(`/api/news/${news.id}`), {
                                method: 'DELETE'
                              });
                              if (response.ok) {
                                dispatch(deleteNews(news.id));
                                showToast('success', `Deleted article "${news.title}"`);
                              } else {
                                showToast('error', 'Failed to delete article.');
                              }
                            } catch (err) {
                              console.error(err);
                              showToast('error', 'Network error.');
                            }
                          }}
                          className="text-red-600 hover:underline font-bold text-xs"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {newsItems.length === 0 && (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-gray-400 dark:text-gray-500">
                        <UploadCloud size={40} className="mx-auto mb-3 opacity-40" />
                        No articles published yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {newsItems.map(news => (
                <div key={news.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-snug line-clamp-2 pr-2">{news.title}</h3>
                    <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-[10px] font-black uppercase shrink-0">{news.category}</span>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <button
                      onClick={async () => {
                        try {
                          const response = await fetch(getApiUrl(`/api/news/${news.id}`), {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ isBreaking: !news.isBreaking })
                          });
                          if (response.ok) {
                            dispatch(toggleBreaking(news.id));
                            showToast('success', `Toggled Breaking for "${news.title}"`);
                          } else {
                            showToast('error', 'Failed to update article status.');
                          }
                        } catch (err) {
                          console.error(err);
                          showToast('error', 'Network error.');
                        }
                      }}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
                        news.isBreaking
                          ? 'bg-red-600 text-white shadow-sm'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-500'
                      }`}
                    >
                      {news.isBreaking ? 'Breaking ⚡' : 'Set Breaking'}
                    </button>
                    
                    <button
                      onClick={async () => {
                        try {
                          const response = await fetch(getApiUrl(`/api/news/${news.id}`), {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ isTrending: !news.isTrending })
                          });
                          if (response.ok) {
                            dispatch(toggleTrending(news.id));
                            showToast('success', `Toggled Trending for "${news.title}"`);
                          } else {
                            showToast('error', 'Failed to update article status.');
                          }
                        } catch (err) {
                          console.error(err);
                          showToast('error', 'Network error.');
                        }
                      }}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
                        news.isTrending
                          ? 'bg-amber-500 text-white shadow-sm'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-500'
                      }`}
                    >
                      {news.isTrending ? 'Trending 🔥' : 'Set Trending'}
                    </button>
                  </div>
                  
                  <div className="flex justify-between items-center pt-2.5 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-400">
                    <span>{news.uploadTime}</span>
                    <button
                      onClick={async () => {
                        try {
                          const response = await fetch(getApiUrl(`/api/news/${news.id}`), {
                            method: 'DELETE'
                          });
                          if (response.ok) {
                            dispatch(deleteNews(news.id));
                            showToast('success', `Deleted article "${news.title}"`);
                          } else {
                            showToast('error', 'Failed to delete article.');
                          }
                        } catch (err) {
                          console.error(err);
                          showToast('error', 'Network error.');
                        }
                      }}
                      className="text-red-600 hover:underline font-bold text-[11px]"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {newsItems.length === 0 && (
                <div className="text-center py-12 text-gray-400 dark:text-gray-500 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                  <UploadCloud size={40} className="mx-auto mb-3 opacity-40" />
                  No articles published yet.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Manage Ticker Tab */}
        {activeTab === 'ticker' && (
          <div className="space-y-6">
            {/* Add Ticker Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 max-w-4xl">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <Plus className="text-primary" size={20} />
                Add New Ticker Item
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Write a short breaking headline in English or Tamil. The system will auto-translate it to ensure proper bilingual scrolling on the homepage.
              </p>
              <form onSubmit={handleAddTickerItem} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={tickerInput}
                  onChange={e => setTickerInput(e.target.value)}
                  placeholder="e.g. India defeats Australia in final match..."
                  className="flex-grow px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-primary text-sm"
                  disabled={isTickerTranslating}
                />
                <button
                  type="submit"
                  disabled={isTickerTranslating}
                  className="px-5 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary/95 transition-colors text-sm flex items-center justify-center gap-2 shrink-0 disabled:opacity-75 font-bold"
                >
                  {isTickerTranslating ? (
                    <><Loader2 size={16} className="animate-spin" /> Auto Translating...</>
                  ) : (
                    <><Plus size={16} /> Add Ticker Item</>
                  )}
                </button>
              </form>
            </div>

            {/* List Active Ticker Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 max-w-4xl">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Megaphone className="text-primary" size={20} />
                Active Ticker Items ({breakingNewsItems.length})
              </h2>

              <div className="space-y-4">
                {breakingNewsItems.map((item, idx) => (
                  <div 
                    key={item.id || idx}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50/50 dark:bg-gray-900/30 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:shadow-sm"
                  >
                    {editingTickerId === item.id ? (
                      <div className="flex-1 space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-gray-400 mb-1">ENGLISH HEADLINE</label>
                            <input
                              type="text"
                              value={editingTickerText}
                              onChange={e => setEditingTickerText(e.target.value)}
                              className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white outline-none text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-400 mb-1">TAMIL HEADLINE (OPTIONAL - WILL AUTO-TRANSLATE IF BLANK)</label>
                            <input
                              type="text"
                              value={editingTickerTextTa}
                              onChange={e => setEditingTickerTextTa(e.target.value)}
                              placeholder="தமிழ் மொழிபெயர்ப்பு..."
                              className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white outline-none text-sm"
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleSaveEditTicker(item.id)}
                            disabled={isTickerTranslating}
                            className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs font-medium flex items-center gap-1 font-bold"
                          >
                            {isTickerTranslating ? <Loader2 size={12} className="animate-spin" /> : null}
                            Save Updates
                          </button>
                          <button
                            type="button"
                            onClick={handleCancelEditTicker}
                            className="px-3 py-1 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 rounded text-xs font-medium"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded font-bold uppercase">EN</span>
                            <p className="text-gray-900 dark:text-white text-sm font-medium">{item.text}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 px-2 py-0.5 rounded font-bold uppercase">TA</span>
                            <p className="text-gray-900 dark:text-white text-sm font-medium">{item.text_ta || '(No Translation)'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleStartEditTicker(item)}
                            className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 dark:text-blue-400 rounded-lg transition-colors"
                            title="Edit Item"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteTicker(item.id)}
                            className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-900/20 dark:hover:bg-red-900/40 dark:text-red-400 rounded-lg transition-colors"
                            title="Delete Item"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}

                {breakingNewsItems.length === 0 && (
                  <div className="text-center py-10 text-gray-400 dark:text-gray-500">
                    <Megaphone size={40} className="mx-auto mb-3 opacity-40 animate-bounce" />
                    No breaking news ticker items found. The scrolling ticker will show a fallback.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
