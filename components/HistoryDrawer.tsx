import React from 'react';
import { HistoryItem, ScriptType } from '../types';
import { X, Video, Phone, MessageSquare, Repeat, Layers, ShieldAlert, Trash2, Clock, Calendar } from 'lucide-react';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
  onClear: () => void;
}

const HistoryDrawer: React.FC<HistoryDrawerProps> = ({ isOpen, onClose, history, onSelect, onDelete, onClear }) => {
  const getTypeIcon = (type: ScriptType) => {
    switch (type) {
      case 'video': return <Video size={16} />;
      case 'voice': return <Phone size={16} />;
      case 'whatsapp': return <MessageSquare size={16} />;
      case 'followup': return <Repeat size={16} />;
      case 'variations': return <Layers size={16} />;
      case 'optout': return <ShieldAlert size={16} />;
      default: return <MessageSquare size={16} />;
    }
  };

  const getTypeColor = (type: ScriptType) => {
     switch (type) {
        case 'video': return 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-500/10 border-purple-200 dark:border-purple-500/20';
        case 'voice': return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-500/10 border-green-200 dark:border-green-500/20';
        case 'whatsapp': return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20';
        default: return 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-500/10 border-slate-200 dark:border-slate-500/20';
      }
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock size={20} className="text-blue-500 dark:text-blue-400" />
              History
            </h2>
            <div className="flex items-center gap-1">
                {history.length > 0 && (
                    <button 
                        onClick={onClear}
                        className="p-2 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition"
                        title="Clear All History"
                    >
                        <Trash2 size={18} />
                    </button>
                )}
                <button 
                onClick={onClose}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
                >
                <X size={20} />
                </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-grow overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {history.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 dark:text-slate-500 space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <Calendar size={24} className="opacity-50" />
                </div>
                <p className="text-sm">No history yet.</p>
                <p className="text-xs text-center max-w-[200px]">Generated scripts will appear here automatically.</p>
              </div>
            ) : (
              history.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => onSelect(item)}
                  className="group bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-500/50 rounded-xl p-4 cursor-pointer transition-all relative"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border ${getTypeColor(item.generatedContent.type)}`}>
                        {getTypeIcon(item.generatedContent.type)}
                        {item.generatedContent.type}
                    </div>
                    <span className="text-xs text-slate-500 font-medium">
                        {formatDate(item.timestamp)}
                    </span>
                  </div>
                  
                  <h3 className="text-slate-900 dark:text-slate-200 font-semibold truncate mb-1">
                    {item.leadData.name || "Unknown Lead"}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate mb-3">
                    {item.leadData.company} • {item.leadData.industry}
                  </p>

                  <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-3 right-3">
                     <button
                        onClick={(e) => onDelete(item.id, e)}
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-400/10 rounded-lg transition"
                        title="Delete"
                     >
                         <Trash2 size={14} />
                     </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default HistoryDrawer;