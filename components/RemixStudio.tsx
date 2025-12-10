
import React, { useState, useRef, useEffect } from 'react';
import { MasterPrompt, AdvancedSettings, Language, LyricsVersion, ProductionSettings } from '../types';
import { refineSunoPrompt } from '../services/geminiService';
import CopyButton from './CopyButton';
import { getTranslation } from '../utils/translations';
import { Send, ArrowLeft, Check, Sparkles, Loader2, Disc, AlignLeft, Settings2, Undo2, History, Wand2, CloudRain, Speaker, Mic2, MessageSquare, SlidersHorizontal } from 'lucide-react';

interface RemixStudioProps {
  apiKey: string;
  initialPrompt: MasterPrompt;
  language: Language;
  onApply: (newPrompt: MasterPrompt) => void;
  onClose: () => void;
}

const RemixStudio: React.FC<RemixStudioProps> = ({ apiKey, initialPrompt, language, onApply, onClose }) => {
  const [currentPrompt, setCurrentPrompt] = useState<MasterPrompt>(initialPrompt);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<{role: 'user'|'model', text: string}[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const t = getTranslation(language);

  // --- Mobile Tab State ---
  const [mobileTab, setMobileTab] = useState<'copilot' | 'lyrics' | 'rack'>('lyrics');

  // --- Lyrics Lab State ---
  const [lyricsHistory, setLyricsHistory] = useState<LyricsVersion[]>([{ content: initialPrompt.lyricsAndStructure, timestamp: Date.now(), note: 'Initial' }]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // --- Production Rack State ---
  const [prodSettings, setProdSettings] = useState<ProductionSettings>({
      foley: [],
      mixing: 'Standard'
  });

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  // Sync lyrics history when prompt changes from API
  useEffect(() => {
    const current = lyricsHistory[historyIndex];
    if (current && current.content !== currentPrompt.lyricsAndStructure) {
        const newVersion: LyricsVersion = {
            content: currentPrompt.lyricsAndStructure,
            timestamp: Date.now(),
            note: 'AI Update'
        };
        const newHistory = [...lyricsHistory.slice(0, historyIndex + 1), newVersion];
        setLyricsHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    }
  }, [currentPrompt.lyricsAndStructure]);

  const handleRefine = async (taskType: 'general' | 'lyrics_polish' | 'production_update', instruction: string = '', settings?: ProductionSettings) => {
    if (isLoading) return;
    setIsLoading(true);

    if (taskType === 'general') {
        setHistory(prev => [...prev, { role: 'user', text: instruction }]);
        setInput('');
    }

    try {
        const result = await refineSunoPrompt(apiKey, currentPrompt, instruction, taskType, settings);
        
        const updated: MasterPrompt = {
            ...currentPrompt,
            title: result.title,
            styleDescription: result.styleDescription,
            lyricsAndStructure: result.lyricsAndStructure,
            advancedSettings: result.advancedSettings,
        };
        
        setCurrentPrompt(updated);
        
        if (taskType === 'general') {
            setHistory(prev => [...prev, { role: 'model', text: 'Project updated.' }]);
        }
    } catch (err) {
        console.error(err);
        setHistory(prev => [...prev, { role: 'model', text: 'Error executing task.' }]);
    } finally {
        setIsLoading(false);
    }
  };

  const handleLyricsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newText = e.target.value;
      setCurrentPrompt(prev => ({ ...prev, lyricsAndStructure: newText }));
  };

  const saveLyricsSnapshot = () => {
      const newVersion: LyricsVersion = {
          content: currentPrompt.lyricsAndStructure,
          timestamp: Date.now(),
          note: 'Manual Edit'
      };
      const newHistory = [...lyricsHistory.slice(0, historyIndex + 1), newVersion];
      setLyricsHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
      if (historyIndex > 0) {
          const prevIndex = historyIndex - 1;
          setHistoryIndex(prevIndex);
          setCurrentPrompt(prev => ({ ...prev, lyricsAndStructure: lyricsHistory[prevIndex].content }));
      }
  };

  const handleMoodSelect = (color: string) => {
      const newSettings = { ...prodSettings, moodColor: color };
      setProdSettings(newSettings);
      handleRefine('production_update', '', newSettings);
  };

  const toggleFoley = (sound: string) => {
      const current = prodSettings.foley || [];
      const updated = current.includes(sound) 
        ? current.filter(s => s !== sound)
        : [...current, sound];
      const newSettings = { ...prodSettings, foley: updated };
      setProdSettings(newSettings);
  };
  
  const applyFoleyUpdate = () => {
      handleRefine('production_update', '', prodSettings);
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handleRefine('general', input);
      }
  }

  const moodColors = [
      { name: 'Red', hex: '#ef4444', label: t.moods.red },
      { name: 'Blue', hex: '#3b82f6', label: t.moods.blue },
      { name: 'Green', hex: '#22c55e', label: t.moods.green },
      { name: 'Purple', hex: '#a855f7', label: t.moods.purple },
      { name: 'Yellow', hex: '#eab308', label: t.moods.yellow },
      { name: 'Zinc', hex: '#52525b', label: t.moods.zinc },
  ];

  return (
    <div className="fixed inset-0 z-[100] bg-[#09090b] text-white flex flex-col animate-in slide-in-from-bottom duration-300">
      {/* Header */}
      <header className="h-14 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between px-4 lg:px-6 shrink-0">
          <div className="flex items-center gap-3 lg:gap-4">
              <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400 hover:text-white">
                  <ArrowLeft size={18} />
              </button>
              <div>
                  <h2 className="font-bold text-xs lg:text-sm tracking-widest uppercase flex items-center gap-2 text-white">
                    <Sparkles size={14} className="text-cyan-400" />
                    {t.remixStudio}
                  </h2>
              </div>
          </div>
          
          <div className="flex items-center gap-3 lg:gap-4">
               {isLoading && <div className="hidden sm:flex items-center gap-2 text-xs text-amber-500 font-mono animate-pulse"><Loader2 size={12} className="animate-spin"/> PROCESSING...</div>}
               <button 
                    onClick={() => onApply(currentPrompt)}
                    className="bg-cyan-600 hover:bg-cyan-500 text-white px-3 py-1.5 lg:px-4 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-[0_0_15px_-5px_rgba(8,145,178,0.5)]"
                >
                    <Check size={14} /> <span className="hidden sm:inline">{t.remixApply}</span> <span className="sm:hidden">APPLY</span>
                </button>
          </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
          
          {/* COLUMN 1: COPILOT (Chat) */}
          <div className={`${mobileTab === 'copilot' ? 'flex' : 'hidden'} lg:flex w-full lg:w-80 border-r border-zinc-800 flex-col bg-zinc-950`}>
              <div className="p-3 border-b border-zinc-800 bg-zinc-900/50">
                  <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{t.colCopilot}</h3>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar" ref={scrollRef}>
                   <div className="flex flex-col items-start">
                      <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[90%]">
                          <p className="text-xs text-zinc-300 leading-relaxed">{t.remixPlaceholder}</p>
                      </div>
                  </div>
                  {history.map((msg, idx) => (
                      <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                          <div className={`rounded-2xl px-4 py-3 max-w-[90%] text-xs leading-relaxed ${
                              msg.role === 'user' 
                              ? 'bg-cyan-900/30 border border-cyan-700/30 text-cyan-100 rounded-tr-sm' 
                              : 'bg-zinc-800/50 border border-zinc-700/50 text-zinc-300 rounded-tl-sm'
                          }`}>
                              {msg.text}
                          </div>
                      </div>
                  ))}
              </div>
              <div className="p-4 border-t border-zinc-800 bg-zinc-950">
                  <div className="relative">
                      <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={t.chatInput + "..."}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-3 pr-10 py-3 text-xs focus:ring-1 focus:ring-cyan-500 outline-none text-white placeholder:text-zinc-600 font-mono"
                      />
                      <button 
                        onClick={() => handleRefine('general', input)}
                        disabled={isLoading || !input.trim()}
                        className="absolute right-2 top-2 p-1.5 bg-zinc-800 hover:bg-cyan-600 text-zinc-400 hover:text-white rounded transition-colors disabled:opacity-50"
                      >
                          <Send size={14} />
                      </button>
                  </div>
              </div>
          </div>

          {/* COLUMN 2: LYRICS LAB (Center) */}
          <div className={`${mobileTab === 'lyrics' ? 'flex' : 'hidden'} lg:flex flex-1 flex-col bg-[#0c0c0e] relative`}>
              <div className="p-3 border-b border-zinc-800 bg-zinc-900/50 flex justify-between items-center">
                  <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{t.colLyrics}</h3>
                  <div className="flex items-center gap-2">
                       <button 
                          onClick={handleUndo} 
                          disabled={historyIndex === 0}
                          className="p-1.5 text-zinc-500 hover:text-white disabled:opacity-30 transition-colors"
                          title={t.undo}
                       >
                           <Undo2 size={14} />
                       </button>
                       <button 
                          onClick={() => setIsHistoryOpen(!isHistoryOpen)} 
                          className={`p-1.5 transition-colors ${isHistoryOpen ? 'text-amber-500' : 'text-zinc-500 hover:text-white'}`}
                          title={t.lyricsHistory}
                       >
                           <History size={14} />
                       </button>
                       <div className="h-4 w-px bg-zinc-800 mx-1"></div>
                       <button 
                          onClick={() => handleRefine('lyrics_polish')}
                          className="flex items-center gap-1.5 bg-amber-900/20 hover:bg-amber-900/40 text-amber-500 border border-amber-500/30 px-3 py-1 rounded text-[10px] font-bold uppercase transition-all"
                          title={t.polishTooltip}
                       >
                           <Wand2 size={12} /> {t.polishBtn}
                       </button>
                  </div>
              </div>
              
              <div className="flex-1 relative flex">
                  <textarea
                    value={currentPrompt.lyricsAndStructure}
                    onChange={handleLyricsChange}
                    onBlur={saveLyricsSnapshot}
                    className="w-full h-full bg-[#0c0c0e] text-zinc-300 font-mono text-sm leading-relaxed p-6 lg:p-8 resize-none outline-none custom-scrollbar selection:bg-amber-500/30"
                    spellCheck={false}
                  />

                  {/* History Sidebar Overlay */}
                  {isHistoryOpen && (
                      <div className="absolute right-0 top-0 bottom-0 w-64 bg-zinc-950 border-l border-zinc-800 z-10 flex flex-col animate-in slide-in-from-right duration-200 shadow-2xl">
                          <div className="p-3 border-b border-zinc-800 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                              {t.lyricsHistory}
                          </div>
                          <div className="flex-1 overflow-y-auto custom-scrollbar">
                              {lyricsHistory.map((ver, i) => (
                                  <div 
                                    key={i} 
                                    onClick={() => {
                                        setCurrentPrompt(prev => ({...prev, lyricsAndStructure: ver.content}));
                                        setHistoryIndex(i);
                                    }}
                                    className={`p-3 border-b border-zinc-800/50 cursor-pointer hover:bg-zinc-900 ${i === historyIndex ? 'bg-zinc-900 border-l-2 border-l-amber-500' : 'opacity-60'}`}
                                  >
                                      <div className="flex justify-between items-center mb-1">
                                          <span className="text-[10px] font-mono text-zinc-500">{new Date(ver.timestamp).toLocaleTimeString()}</span>
                                          <span className="text-[9px] bg-zinc-800 px-1 rounded text-zinc-400">{ver.note}</span>
                                      </div>
                                      <div className="text-[10px] text-zinc-600 truncate font-mono">
                                          {ver.content.slice(0, 30)}...
                                      </div>
                                  </div>
                              ))}
                          </div>
                      </div>
                  )}
              </div>
          </div>

          {/* COLUMN 3: PRODUCTION RACK (Right) */}
          <div className={`${mobileTab === 'rack' ? 'flex' : 'hidden'} lg:flex w-full lg:w-72 border-l border-zinc-800 flex-col bg-zinc-950`}>
               <div className="p-3 border-b border-zinc-800 bg-zinc-900/50">
                  <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{t.colRack}</h3>
              </div>
              <div className="flex-1 overflow-y-auto p-5 space-y-8 custom-scrollbar">
                  
                  {/* Style Display */}
                  <div className="space-y-2">
                       <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest block">{t.stylePrompt}</label>
                       <div className="daw-slot p-3 rounded text-[10px] font-mono text-cyan-200/80 leading-relaxed border-cyan-900/30">
                           {currentPrompt.styleDescription}
                       </div>
                  </div>

                  {/* Mood Palette */}
                  <div className="space-y-3">
                      <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest flex items-center gap-2">
                          <Disc size={12}/> {t.moodPalette}
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                          {moodColors.map((mood) => (
                              <button
                                key={mood.name}
                                onClick={() => handleMoodSelect(mood.hex)}
                                className={`h-10 rounded border border-zinc-800 hover:scale-105 transition-transform relative group ${prodSettings.moodColor === mood.hex ? 'ring-2 ring-white' : ''}`}
                                style={{ backgroundColor: mood.hex }}
                                title={mood.label}
                              >
                                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 transition-opacity">
                                      <span className="text-[9px] font-bold text-white uppercase">{mood.name}</span>
                                  </div>
                              </button>
                          ))}
                      </div>
                      <p className="text-[9px] text-zinc-600 italic text-center">Select color to inject vibe...</p>
                  </div>

                  {/* Foley Rack */}
                  <div className="space-y-3">
                       <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest flex items-center gap-2">
                          <CloudRain size={12}/> {t.foleyRack}
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                          {['Rain', 'Vinyl', 'City', 'Tape'].map(f => (
                              <button
                                key={f}
                                onClick={() => toggleFoley(f)}
                                className={`px-2 py-2 rounded border text-[10px] font-bold uppercase transition-all ${
                                    prodSettings.foley?.includes(f) 
                                    ? 'bg-amber-900/30 border-amber-600 text-amber-500 shadow-[0_0_10px_-4px_rgba(245,158,11,0.5)]' 
                                    : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300'
                                }`}
                              >
                                  {f}
                              </button>
                          ))}
                      </div>
                      <button onClick={applyFoleyUpdate} className="w-full py-1.5 mt-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-[10px] text-zinc-400 uppercase font-bold rounded">
                          {t.applyVibe}
                      </button>
                  </div>

                  {/* Mixing Console */}
                  <div className="space-y-3">
                       <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest flex items-center gap-2">
                          <Speaker size={12}/> {t.mixingConsole}
                      </label>
                      <select 
                        className="w-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 rounded p-2 outline-none focus:border-cyan-500"
                        onChange={(e) => handleRefine('production_update', '', { ...prodSettings, mixing: e.target.value })}
                        value={prodSettings.mixing}
                      >
                          <option value="Standard">Standard Mix</option>
                          <option value="Dry">Dry / Studio</option>
                          <option value="Hall">Concert Hall</option>
                          <option value="Lo-fi">Lo-Fi / Radio</option>
                          <option value="Wide">Stereo Wide</option>
                      </select>
                  </div>

              </div>
          </div>

      </div>

      {/* MOBILE TAB BAR */}
      <div className="lg:hidden h-16 bg-zinc-950 border-t border-zinc-800 flex items-center justify-around shrink-0 pb-safe z-50">
            <button 
                onClick={() => setMobileTab('copilot')} 
                className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${mobileTab === 'copilot' ? 'text-cyan-400' : 'text-zinc-500'}`}
            >
                <MessageSquare size={18} />
                <span className="text-[9px] font-bold uppercase tracking-wide">{t.colCopilot}</span>
            </button>
            <button 
                onClick={() => setMobileTab('lyrics')} 
                className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${mobileTab === 'lyrics' ? 'text-amber-500' : 'text-zinc-500'}`}
            >
                <AlignLeft size={18} />
                <span className="text-[9px] font-bold uppercase tracking-wide">{t.colLyrics}</span>
            </button>
            <button 
                onClick={() => setMobileTab('rack')} 
                className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${mobileTab === 'rack' ? 'text-pink-400' : 'text-zinc-500'}`}
            >
                <SlidersHorizontal size={18} />
                <span className="text-[9px] font-bold uppercase tracking-wide">{t.colRack}</span>
            </button>
      </div>

    </div>
  );
};

export default RemixStudio;
