import React, { useState, useEffect } from 'react';
import { Video, Phone, MessageSquare, Repeat, Layers, ShieldAlert, Sparkles, Layout, History as HistoryIcon, LogOut, Crown, User as UserIcon, Sun, Moon } from 'lucide-react';
import LeadForm from './components/LeadForm';
import ResultDisplay from './components/ResultDisplay';
import HistoryDrawer from './components/HistoryDrawer';
import AuthModal from './components/AuthModal';
import PricingModal from './components/PricingModal';
import { generateScript } from './services/geminiService';
import { getHistory, saveItem, deleteItem, saveDraft, getDraft, clearHistory } from './services/storageService';
import { supabase, getProfile, incrementUsage } from './services/supabase';
import { LeadData, GeneratedContent, ScriptType, HistoryItem, UserProfile } from './types';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ScriptType>('video');
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  
  // Theme State
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved as 'light' | 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark';
  });

  // Auth & Subscription State
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [localUsage, setLocalUsage] = useState(0);

  const [leadData, setLeadData] = useState<LeadData>({
    name: '',
    role: '',
    company: '',
    industry: '',
    painPoint: '',
    productDescription: '',
    tone: 'Professional',
    language: 'English',
    channel: 'SMS',
    daysAgo: '3'
  });

  // Theme Effect
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Init
  useEffect(() => {
    // 1. Load History & Draft
    setHistory(getHistory());
    const savedDraft = getDraft();
    if (savedDraft) setLeadData(savedDraft);
    
    // 2. Load Local Usage (for non-logged in users)
    const usage = localStorage.getItem('guest_usage');
    setLocalUsage(usage ? parseInt(usage) : 0);

    // 3. Check Supabase Session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      else setProfile(null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    const data = await getProfile(userId);
    if (data) setProfile(data);
  };

  // Save draft debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      saveDraft(leadData);
    }, 500);
    return () => clearTimeout(timer);
  }, [leadData]);

  const handleLeadChange = (key: keyof LeadData, value: string) => {
    setLeadData((prev) => ({ ...prev, [key]: value }));
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setGeneratedContent(null);
  };

  const checkLimits = (): boolean => {
    // Case 1: Not Logged In
    if (!user) {
      if (localUsage >= 1) {
        setShowAuthModal(true);
        setError("Free guest limit reached. Please sign up to continue.");
        return false;
      }
      return true;
    }

    // Case 2: Logged In
    if (profile) {
      if (profile.is_pro) {
        if (profile.usage_count >= 30) {
          setError("Monthly Pro limit (30) reached. Limit resets next month.");
          return false;
        }
      } else {
        if (profile.usage_count >= 1) {
          setShowPricingModal(true);
          return false;
        }
      }
      return true;
    }
    
    return false;
  };

  const updateUsage = async () => {
    if (!user) {
      const newUsage = localUsage + 1;
      setLocalUsage(newUsage);
      localStorage.setItem('guest_usage', newUsage.toString());
    } else {
      if (user && profile) {
        await incrementUsage(user.id);
        fetchProfile(user.id);
      }
    }
  };

  const handleGenerate = async () => {
    if (!checkLimits()) return;

    if (!leadData.name || !leadData.company || !leadData.productDescription) {
        alert("Please fill in Name, Company, and Product Description.");
        return;
    }

    setLoading(true);
    setError(null);
    setGeneratedContent(null);

    try {
      const result = await generateScript(leadData, activeTab);
      const content: GeneratedContent = {
        type: activeTab,
        data: result,
        timestamp: new Date().toISOString(),
      };
      
      setGeneratedContent(content);

      // Update limits
      await updateUsage();

      // Save to history
      const newItem: HistoryItem = {
          id: Math.random().toString(36).substr(2, 9),
          leadData: { ...leadData }, 
          generatedContent: content,
          timestamp: new Date().toISOString()
      };
      const updatedHistory = saveItem(newItem);
      setHistory(updatedHistory);

    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectHistory = (item: HistoryItem) => {
      setLeadData(item.leadData);
      setGeneratedContent(item.generatedContent);
      setError(null);
      setActiveTab(item.generatedContent.type);
      setShowHistory(false);
  };

  const handleDeleteHistory = (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      const updated = deleteItem(id);
      setHistory(updated);
  };

  const handleClearHistory = () => {
      if (window.confirm("Are you sure you want to clear all history?")) {
          clearHistory();
          setHistory([]);
      }
  };

  const tabs: { id: ScriptType; label: string; icon: React.ReactNode }[] = [
    { id: 'video', label: 'Video Script', icon: <Video size={18} /> },
    { id: 'voice', label: 'Voice Call', icon: <Phone size={18} /> },
    { id: 'whatsapp', label: 'WhatsApp/SMS', icon: <MessageSquare size={18} /> },
    { id: 'followup', label: 'Follow Up', icon: <Repeat size={18} /> },
    { id: 'variations', label: 'Variations', icon: <Layers size={18} /> },
    { id: 'optout', label: 'Opt-Out', icon: <ShieldAlert size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 font-sans selection:bg-blue-500/30 transition-colors duration-300">
      
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {}}
      />

      <PricingModal
        isOpen={showPricingModal}
        onClose={() => setShowPricingModal(false)}
        userId={user?.id}
        onSuccess={() => fetchProfile(user.id)}
      />
      
      <HistoryDrawer 
        isOpen={showHistory} 
        onClose={() => setShowHistory(false)} 
        history={history} 
        onSelect={handleSelectHistory}
        onDelete={handleDeleteHistory}
        onClear={handleClearHistory}
      />

      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Sparkles className="text-white w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
              AI Sales Agent
            </h1>
          </div>
          <div className="flex items-center gap-4">
             {/* Usage Pill */}
             <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-400 transition-colors">
               {user ? (
                 profile?.is_pro ? (
                   <span className="text-yellow-600 dark:text-yellow-400 flex items-center gap-1"><Crown size={12}/> Pro: {profile.usage_count}/30</span>
                 ) : (
                   <span>Free: {profile?.usage_count || 0}/1</span>
                 )
               ) : (
                 <span>Guest: {localUsage}/1</span>
               )}
             </div>

             <button
               onClick={toggleTheme}
               className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400 transition-colors"
               title="Toggle Theme"
             >
               {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
             </button>

             <button 
                onClick={() => setShowHistory(true)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
             >
                <HistoryIcon size={18} />
                <span className="hidden sm:inline">History</span>
             </button>
            
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-2 hidden sm:block"></div>
            
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-slate-700 dark:text-white hidden sm:block">{profile?.email?.split('@')[0]}</span>
                <button 
                  onClick={handleLogout}
                  className="p-2 hover:bg-red-50 text-slate-500 hover:text-red-500 dark:hover:bg-red-500/10 dark:text-slate-400 dark:hover:text-red-400 rounded-lg transition"
                  title="Sign Out"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setShowAuthModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-bold transition shadow-lg shadow-blue-900/20"
              >
                <UserIcon size={16} />
                Login
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Tab Navigation */}
        <div className="flex overflow-x-auto pb-4 gap-2 mb-6 custom-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap border ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-900/50'
                  : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-auto lg:h-[calc(100vh-12rem)]">
          
          {/* Left Column: Input */}
          <div className="lg:col-span-5 h-full overflow-y-auto pr-1 custom-scrollbar pb-10">
            <div className="space-y-6">
                <LeadForm leadData={leadData} onChange={handleLeadChange} />
                
                <button
                    onClick={handleGenerate}
                    disabled={loading}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-900/20 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Generating...
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-5 h-5" />
                            Generate Script
                        </>
                    )}
                </button>

                {/* Workflow Visualization (Static Representation) */}
                <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800 opacity-60 hover:opacity-100 transition-opacity">
                    <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-4 flex items-center gap-2">
                        <Layout size={14} /> Automation Workflow
                    </h3>
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-500 bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800 overflow-x-auto">
                        <div className="flex flex-col items-center gap-2 min-w-[60px]">
                             <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center">Lead</div>
                        </div>
                        <div className="h-0.5 w-8 bg-slate-200 dark:bg-slate-700"></div>
                        <div className="flex flex-col items-center gap-2 min-w-[60px]">
                             <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-500/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">AI</div>
                        </div>
                        <div className="h-0.5 w-8 bg-slate-200 dark:bg-slate-700"></div>
                         <div className="flex flex-col items-center gap-2 min-w-[60px]">
                             <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center">Json</div>
                        </div>
                        <div className="h-0.5 w-8 bg-slate-200 dark:bg-slate-700"></div>
                        <div className="flex flex-col items-center gap-2 min-w-[60px]">
                             <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center">Sent</div>
                        </div>
                    </div>
                </div>
            </div>
          </div>

          {/* Right Column: Result */}
          <div className="lg:col-span-7 h-full flex flex-col">
            <ResultDisplay content={generatedContent} loading={loading} error={error} />
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;