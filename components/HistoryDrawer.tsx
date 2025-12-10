
import React, { useState, useEffect } from 'react';
import { HistoryItem, Language } from '../types';
import { getHistory, deleteHistoryItem, generateSunoDocument } from '../services/historyService';
import { getTranslation } from '../utils/translations';
import { X, Search, FileText, Download, Trash2, ChevronRight, Music, Library } from 'lucide-react';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onLoad: (item: HistoryItem) => void;
  language: Language;
}

const HistoryDrawer: React.FC<HistoryDrawerProps> = ({ isOpen, onClose, onLoad, language }) => {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const t = getTranslation(language);

  useEffect(() => {
    if (isOpen) {
      setItems(getHistory());
    }
  }, [isOpen]);

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setItems(deleteHistoryItem(id));
  };

  const handleExport = (e: React.MouseEvent, item: HistoryItem) => {
    e.stopPropagation();
    const content = generateSunoDocument(item);
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SunoArchitect_${item.result.masterPrompt.title.replace(/\s+/g, '_')}_${item.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredItems = items.filter(item => 
    item.result.masterPrompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.inputSummary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]" onClick={onClose} />
      )}

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-[#0c0c0e] border-l border-zinc-800 shadow-2xl z-[70] transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 bg-zinc-950/50 backdrop-blur">
          <div className="flex items-center justify-between mb-4">
             <h2 className="text-sm font-bold text-zinc-100 uppercase tracking-widest flex items-center gap-2">
                <Library size={16} className="text-amber-500" />
                {t.libraryTitle}
             </h2>
             <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
                <X size={18} />
             </button>
          </div>
          
          <div className="relative">
            <Search size={14} className="absolute left-3 top-3 text-zinc-600" />
            <input 
              type="text" 
              placeholder={t.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500/50 transition-colors"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
           {filteredItems.length === 0 ? (
             <div className="text-center py-10 text-zinc-600 text-xs font-mono">
               {t.emptyLibrary}
             </div>
           ) : (
             filteredItems.map(item => (
               <div 
                 key={item.id} 
                 onClick={() => { onLoad(item); onClose(); }}
                 className="group bg-zinc-900/40 border border-zinc-800/50 hover:bg-zinc-800/50 hover:border-amber-500/30 rounded-lg p-3 cursor-pointer transition-all relative overflow-hidden"
               >
                 <div className="absolute left-0 top-0 bottom-0 w-1 bg-zinc-800 group-hover:bg-amber-600 transition-colors"></div>
                 
                 <div className="pl-3">
                    <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-sm text-zinc-200 truncate pr-2">{item.result.masterPrompt.title || "Untitled"}</h3>
                        <span className="text-[10px] text-zinc-600 font-mono whitespace-nowrap">{new Date(item.timestamp).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                       <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-zinc-500 font-mono">{item.result.analysis.genre.split('/')[0]}</span>
                       <span className="text-[10px] text-zinc-500 truncate">{item.inputSummary}</span>
                    </div>

                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-zinc-800/50 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button 
                            onClick={(e) => handleExport(e, item)}
                            className="flex items-center gap-1 text-[10px] font-bold text-zinc-400 hover:text-cyan-400 bg-zinc-950 border border-zinc-800 px-2 py-1 rounded transition-colors"
                         >
                            <Download size={10} /> {t.exportProject}
                         </button>
                         <button 
                            onClick={(e) => handleDelete(e, item.id)}
                            className="flex items-center gap-1 text-[10px] font-bold text-zinc-600 hover:text-red-400 ml-auto px-2 py-1 transition-colors"
                         >
                            <Trash2 size={12} />
                         </button>
                    </div>
                 </div>
               </div>
             ))
           )}
        </div>
        
        {/* Footer */}
        <div className="p-3 border-t border-zinc-800 text-[10px] text-zinc-600 text-center font-mono">
            {filteredItems.length} PROJECTS STORED
        </div>
      </div>
    </>
  );
};

export default HistoryDrawer;
