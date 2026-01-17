
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Dices, 
  Settings2, 
  RotateCcw, 
  History as HistoryIcon, 
  Copy, 
  Sparkles,
  Trash2,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { RNGResult, GeneratorConfig } from './types';

// UI Components
const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <div className={`bg-slate-800/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl ${className}`}>
    {children}
  </div>
);

const Button: React.FC<{ 
  onClick: () => void; 
  children: React.ReactNode; 
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'; 
  className?: string;
  disabled?: boolean;
}> = ({ onClick, children, variant = 'primary', className = "", disabled = false }) => {
  const variants = {
    primary: "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20 shadow-lg",
    secondary: "bg-slate-700 hover:bg-slate-600 text-slate-100",
    danger: "bg-rose-600 hover:bg-rose-500 text-white",
    ghost: "bg-transparent hover:bg-white/5 text-slate-400 hover:text-white"
  };

  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

const App: React.FC = () => {
  const [config, setConfig] = useState<GeneratorConfig>({
    min: 1,
    max: 100,
    allowDuplicates: true
  });
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [history, setHistory] = useState<RNGResult[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const numberDisplayRef = useRef<HTMLDivElement>(null);

  const generateNumber = useCallback(() => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    
    // Smooth number animation effect
    let iterations = 0;
    const maxIterations = 15;
    const interval = setInterval(() => {
      const tempNum = Math.floor(Math.random() * (config.max - config.min + 1)) + config.min;
      setCurrentNumber(tempNum);
      iterations++;
      
      if (iterations >= maxIterations) {
        clearInterval(interval);
        const finalNum = Math.floor(Math.random() * (config.max - config.min + 1)) + config.min;
        setCurrentNumber(finalNum);
        setIsGenerating(false);

        // Success Celebrations
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#6366f1', '#a855f7', '#ec4899', '#3b82f6'],
          zIndex: 999
        });

        const result: RNGResult = {
          id: Math.random().toString(36).substr(2, 9),
          value: finalNum,
          timestamp: Date.now(),
          min: config.min,
          max: config.max
        };
        setHistory(prev => [result, ...prev].slice(0, 50));
      }
    }, 40);
  }, [config, isGenerating]);

  const copyToClipboard = () => {
    if (currentNumber !== null) {
      navigator.clipboard.writeText(currentNumber.toString());
    }
  };

  const clearHistory = () => setHistory([]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />

      {/* Main Content Container */}
      <div className="w-full max-w-xl z-10 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8 px-2">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-500/20 rounded-2xl border border-indigo-500/30">
              <Dices className="w-6 h-6 text-indigo-400" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white uppercase tracking-widest">MLH RAFFLE</h1>
          </div>
          <Button 
            variant="ghost" 
            onClick={() => setShowHistory(!showHistory)}
            className="hidden sm:flex"
          >
            <HistoryIcon className="w-5 h-5" />
            <span>{showHistory ? 'Hide History' : 'History'}</span>
          </Button>
        </div>

        {/* Generator Card */}
        <Card className="flex flex-col items-center gap-8 py-12 md:py-16">
          <div 
            className="relative group flex items-center justify-center min-h-[160px] w-full"
            ref={numberDisplayRef}
          >
            {currentNumber !== null ? (
              <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
                <span className={`text-8xl md:text-9xl font-black tracking-tighter mono transition-all duration-300 ${isGenerating ? 'opacity-50 scale-90 blur-sm' : 'text-white drop-shadow-[0_0_25px_rgba(99,102,241,0.5)]'}`}>
                  {currentNumber}
                </span>
                {!isGenerating && (
                  <button 
                    onClick={copyToClipboard}
                    className="mt-4 flex items-center gap-2 text-slate-400 hover:text-indigo-400 transition-colors text-sm font-medium"
                  >
                    <Copy className="w-4 h-4" />
                    Copy Result
                  </button>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center text-slate-500 animate-float">
                <Sparkles className="w-16 h-16 mb-4 opacity-20" />
                <p className="text-lg font-medium">Ready for the draw?</p>
              </div>
            )}
          </div>

          <div className="w-full max-w-sm flex flex-col gap-6">
            <Button 
              onClick={generateNumber} 
              disabled={isGenerating}
              className="w-full py-5 text-xl rounded-[2rem] shadow-2xl hover:scale-[1.02]"
            >
              {isGenerating ? (
                <RotateCcw className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  <Dices className="w-6 h-6" />
                  Draw Number
                </>
              )}
            </Button>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Minimum</label>
                <div className="relative group">
                  <input 
                    type="number"
                    value={config.min}
                    onChange={(e) => setConfig({ ...config, min: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-lg font-semibold mono"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Maximum</label>
                <div className="relative group">
                  <input 
                    type="number"
                    value={config.max}
                    onChange={(e) => setConfig({ ...config, max: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-lg font-semibold mono"
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* History Section - Always visible on mobile, toggleable on desktop */}
        <div className={`transition-all duration-300 ${showHistory ? 'opacity-100 scale-100' : 'hidden sm:block opacity-100'}`}>
          <div className="flex items-center justify-between mb-4 px-2">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <HistoryIcon className="w-5 h-5 text-slate-400" />
              Previous Draws
            </h2>
            {history.length > 0 && (
              <button 
                onClick={clearHistory}
                className="text-sm text-slate-500 hover:text-rose-400 flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Reset
              </button>
            )}
          </div>

          {history.length > 0 ? (
            <div className="grid grid-cols-1 gap-3">
              {history.map((item) => (
                <div 
                  key={item.id}
                  className="bg-slate-800/20 border border-white/5 rounded-2xl p-4 flex items-center justify-between group hover:bg-slate-800/40 transition-all animate-in slide-in-from-top-2"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold mono text-indigo-400">{item.value}</span>
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-500 font-medium">Range: {item.min} – {item.max}</span>
                      <span className="text-[10px] text-slate-600 uppercase tracking-tighter">
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => navigator.clipboard.writeText(item.value.toString())}
                    className="p-2 opacity-0 group-hover:opacity-100 hover:bg-indigo-500/10 rounded-lg text-slate-400 hover:text-indigo-400 transition-all"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-slate-800/10 border border-dashed border-white/5 rounded-2xl p-8 flex flex-col items-center justify-center text-slate-600">
              <HistoryIcon className="w-8 h-8 mb-2 opacity-20" />
              <p className="text-sm">No draws yet</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-slate-600 text-xs mt-12">
          MLH RAFFLE — Designed with <Sparkles className="w-3 h-3 inline text-indigo-500 mx-0.5" /> for total randomness.
        </p>
      </div>
    </div>
  );
};

export default App;
