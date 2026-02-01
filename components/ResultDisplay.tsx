import React from 'react';
import { GeneratedContent } from '../types';
import { Copy, Check, Terminal, Video, Phone, MessageCircle, Repeat, Play, Mic, MessageSquare, ShieldAlert } from 'lucide-react';

interface ResultDisplayProps {
  content: GeneratedContent | null;
  loading: boolean;
  error?: string | null;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ content, loading, error }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    if (!content) return;
    navigator.clipboard.writeText(JSON.stringify(content.data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-white/50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 animate-pulse transition-colors">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-600 dark:text-slate-400 font-medium">Generating sales script...</p>
        <p className="text-slate-500 text-sm mt-2">Connecting to Gemini AI</p>
      </div>
    );
  }

  if (error) {
    return (
        <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-white/50 dark:bg-slate-900/50 rounded-xl border border-red-200 dark:border-red-500/30 text-slate-800 dark:text-slate-300 p-8 text-center animate-in fade-in zoom-in-95 duration-300 transition-colors">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-200 dark:border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                <ShieldAlert size={32} className="text-red-500 dark:text-red-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Generation Failed</h3>
            <p className="text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed mb-6">{error}</p>
            <div className="text-xs text-slate-600 dark:text-slate-600 bg-slate-100 dark:bg-slate-950 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800/50 font-mono">
               Error Code: {error.includes("API Key") ? "AUTH_ERROR" : error.includes("Network") ? "NET_ERR" : "GEN_ERR"}
            </div>
        </div>
    );
  }

  if (!content) {
    return (
      <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-white dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-500 transition-colors">
        <Terminal className="w-12 h-12 mb-4 opacity-50" />
        <p className="font-medium">Ready to generate</p>
        <p className="text-sm text-center max-w-xs mt-2">
          Fill out the lead context and select a generation mode to create your script.
        </p>
      </div>
    );
  }

  const renderContent = () => {
    switch (content.type) {
      case 'video':
        return (
          <div className="space-y-6">
            {/* Video Preview Simulation */}
            <div className="bg-slate-950 rounded-xl overflow-hidden border border-slate-700 relative aspect-video flex items-center justify-center group shadow-2xl">
               {/* Abstract Background */}
               <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-slate-900 to-blue-900/20"></div>
               
               {/* Simulated Avatar/Speaker */}
               <div className="absolute inset-0 flex items-center justify-center opacity-30">
                  <div className="w-32 h-32 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center">
                    <Video size={48} className="text-slate-600" />
                  </div>
               </div>

               {/* Center Play Button */}
               <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center z-10">
                  <button className="w-16 h-16 bg-blue-600 hover:bg-blue-500 text-white rounded-full flex items-center justify-center mb-6 transition-transform transform group-hover:scale-110 shadow-lg shadow-blue-900/50 cursor-pointer">
                      <Play fill="currentColor" size={24} className="ml-1" />
                  </button>
                  
                  {/* Captions Preview */}
                  <div className="bg-black/70 backdrop-blur-md px-6 py-3 rounded-xl border border-white/10 max-w-lg shadow-lg">
                      <p className="text-white font-medium text-lg leading-relaxed animate-pulse">
                        "{content.data.hook || "Video Hook Preview"}"
                      </p>
                  </div>
               </div>
               
               {/* Player Controls (Mock) */}
               <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent z-20">
                  <div className="flex items-center gap-3">
                     <Play size={14} fill="currentColor" className="text-white" />
                     <div className="h-1 flex-grow bg-slate-700 rounded-full overflow-hidden cursor-pointer">
                        <div className="h-full w-1/3 bg-blue-500 rounded-full"></div>
                     </div>
                     <span className="text-xs text-white/70 font-mono">0:05 / 0:30</span>
                  </div>
               </div>
               
               {/* Badge */}
               <div className="absolute top-4 left-4 bg-blue-500/20 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-blue-300 uppercase tracking-wider border border-blue-500/30 flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></div>
                  Preview Mode
               </div>
            </div>

            <div className="space-y-4">
              <Section title="Hook" content={content.data.hook} icon={<Video size={16} />} />
              <Section title="Main Message" content={content.data.main_message} />
              <Section title="Personalization" content={content.data.personalization_line} />
              <Section title="Call to Action" content={content.data.cta} highlight />
            </div>
          </div>
        );
      case 'voice':
        return (
          <div className="space-y-4">
             {/* Audio Waveform Visualization Placeholder */}
             <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-4 mb-2">
                <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 flex items-center justify-center shrink-0">
                   <Mic size={24} />
                </div>
                <div className="flex-grow space-y-2">
                   <div className="h-8 flex items-end gap-1 opacity-50">
                      {[40, 60, 30, 80, 50, 90, 40, 70, 30, 60, 40, 50].map((h, i) => (
                         <div key={i} style={{ height: `${h}%` }} className="w-1.5 bg-green-500 rounded-t-sm"></div>
                      ))}
                      {[40, 60, 30, 80, 50, 90, 40, 70, 30, 60, 40, 50].reverse().map((h, i) => (
                         <div key={`r-${i}`} style={{ height: `${h}%` }} className="w-1.5 bg-green-500 rounded-t-sm hidden sm:block"></div>
                      ))}
                   </div>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">0:45</div>
             </div>

            <Section title="Greeting" content={content.data.greeting} icon={<Phone size={16} />} />
            <Section title="Pitch" content={content.data.pitch} />
            <Section title="Value Prop" content={content.data.value_statement} />
            <Section title="CTA" content={content.data.cta} highlight />
            <Section title="Fallback" content={content.data.fallback_if_no_response} sub />
          </div>
        );
      case 'whatsapp':
        return (
            <div className="space-y-4">
               {/* Message Bubble Preview */}
               <div className="bg-slate-100 dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col gap-4 mb-2 bg-opacity-50" style={{ backgroundImage: 'radial-gradient(circle at center, #94a3b8 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                  <div className="self-end bg-green-100 dark:bg-green-600/20 border border-green-200 dark:border-green-500/30 text-green-900 dark:text-green-100 p-3 rounded-2xl rounded-tr-none max-w-[85%] relative">
                     <p className="text-sm leading-relaxed">{content.data.message}</p>
                     <span className="text-[10px] text-green-700 dark:text-green-300/60 block text-right mt-1">10:42 AM • Read</span>
                  </div>
               </div>
               <Section title="Message Content" content={content.data.message} icon={<MessageCircle size={16} />} highlight />
            </div>
        );
      case 'followup':
        return (
            <div className="space-y-4">
               <Section title="Follow Up" content={content.data.follow_up_message} icon={<MessageCircle size={16} />} />
            </div>
        );
      case 'variations':
        return (
            <div className="space-y-4">
                {Array.isArray(content.data) && content.data.map((item: any, idx: number) => (
                    <div key={idx} className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-blue-500/50 transition-colors group cursor-pointer">
                        <div className="flex items-center justify-between mb-2">
                             <div className="flex items-center gap-2">
                                <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide ${
                                    item.variation.toLowerCase().includes('friendly') ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300' :
                                    item.variation.toLowerCase().includes('professional') ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300' :
                                    'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300'
                                }`}>
                                    {item.variation}
                                </span>
                             </div>
                             <Copy size={14} className="text-slate-400 dark:text-slate-600 group-hover:text-blue-500 dark:group-hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <p className="text-slate-800 dark:text-slate-300">{item.message}</p>
                    </div>
                ))}
            </div>
        );
      case 'optout':
        return (
            <div className="space-y-4">
                 <Section title="Opt-out Text" content={content.data.opt_out_text} highlight />
            </div>
        );
      default:
        return <pre className="text-xs overflow-auto text-slate-500 dark:text-slate-400">{JSON.stringify(content.data, null, 2)}</pre>;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 flex flex-col h-full overflow-hidden transition-colors duration-300">
      <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
        <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg ${
                content.type === 'video' ? 'bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400' :
                content.type === 'voice' ? 'bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400' :
                'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400'
            }`}>
                 {content.type === 'video' && <Video size={18} />}
                 {content.type === 'voice' && <Phone size={18} />}
                 {content.type === 'whatsapp' && <MessageSquare size={18} />}
                 {content.type === 'followup' && <Repeat size={18} />}
                 {content.type === 'variations' && <Repeat size={18} />}
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white capitalize">{content.type} Output</h3>
        </div>
        <button
          onClick={handleCopy}
          className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition flex items-center gap-2 text-sm"
        >
          {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
          {copied ? 'Copied JSON' : 'Copy JSON'}
        </button>
      </div>
      
      <div className="p-6 overflow-y-auto flex-grow custom-scrollbar">
        {renderContent()}
      </div>

      <div className="p-3 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 flex justify-between">
          <span>Generated by Gemini 3 Flash</span>
          <span>{new Date(content.timestamp).toLocaleTimeString()}</span>
      </div>
    </div>
  );
};

const Section: React.FC<{ title: string; content: string; icon?: React.ReactNode; highlight?: boolean; sub?: boolean }> = ({ title, content, icon, highlight, sub }) => (
  <div className={`p-4 rounded-lg border transition-colors ${
    highlight 
      ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-500/30' 
      : sub 
        ? 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800' 
        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700'
  }`}>
    <div className="flex items-center gap-2 mb-2 text-slate-500 dark:text-slate-400 uppercase text-xs font-bold tracking-wider">
      {icon}
      {title}
    </div>
    <p className={`whitespace-pre-wrap leading-relaxed ${
      highlight 
        ? 'text-blue-900 dark:text-blue-100' 
        : 'text-slate-800 dark:text-slate-200'
    } ${sub ? 'text-sm text-slate-600 dark:text-slate-400' : ''}`}>
      {content || "N/A"}
    </p>
  </div>
);

export default ResultDisplay;