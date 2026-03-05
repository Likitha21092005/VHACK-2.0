import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Type, Image, Mic, Shuffle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { sampleDataset } from './sampleDataset';

const LEVEL_COLORS = {
  1: { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-400', label: 'L1 Safe' },
  2: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400', label: 'L2 Mild' },
  3: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-400', label: 'L3 Moderate' },
  4: { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400', label: 'L4 High' },
  5: { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400', label: 'L5 Extreme' },
};

const CATEGORIES = ['safe', 'complaint', 'harassment', 'abuse', 'threat'];

export default function ContentInput({ onSubmit, isProcessing }) {
  const [inputMode, setInputMode] = useState('sample'); // 'sample' or 'custom'
  const [contentType, setContentType] = useState('text');
  const [selectedItem, setSelectedItem] = useState(null);
  const [customContent, setCustomContent] = useState('');
  const [customCategory, setCustomCategory] = useState('safe');
  const [customScore, setCustomScore] = useState(50);
  const [filterLevel, setFilterLevel] = useState('all');

  const items = sampleDataset[contentType] || [];
  const filteredItems = filterLevel === 'all' ? items : items.filter(i => i.level === parseInt(filterLevel));

  const handleSampleSubmit = () => {
    if (!selectedItem) return;
    onSubmit({
      type: contentType, content: selectedItem.content, url: null,
      prefilled: {
        negativity_score: selectedItem.negativity_score, level: selectedItem.level,
        category: selectedItem.category,
        label: selectedItem.level >= 4 ? 'toxic' : selectedItem.level === 5 ? 'threat' : selectedItem.level <= 1 ? 'positive' : 'neutral',
        confidence: 0.92,
      },
    });
    setSelectedItem(null);
  };

  const handleCustomSubmit = () => {
    if (!customContent.trim()) return;
    const levelMap = { 0: 1, 25: 2, 50: 3, 75: 4, 100: 5 };
    const customLevel = levelMap[customScore] || 3;
    onSubmit({
      type: contentType,
      content: customContent,
      url: null,
      prefilled: {
        negativity_score: customScore,
        level: customLevel,
        category: customCategory,
        label: customScore > 70 ? 'threat' : customScore > 50 ? 'toxic' : customScore > 30 ? 'neutral' : 'positive',
        confidence: 0.85,
      },
    });
    setCustomContent('');
    setCustomScore(50);
    setCustomCategory('safe');
  };

  const pickRandom = () => {
    if (filteredItems.length === 0) return;
    setSelectedItem(filteredItems[Math.floor(Math.random() * filteredItems.length)]);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="p-5 rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl flex flex-col gap-4">
      <h3 className="text-base font-semibold text-white flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        Content Submission
      </h3>
      
      {/* Input Mode Tabs */}
      <div className="flex gap-2 border-b border-slate-700/50">
        <button
          onClick={() => setInputMode('sample')}
          className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
            inputMode === 'sample'
              ? 'border-cyan-400 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-slate-300'
          }`}
        >
          Sample Dataset
        </button>
        <button
          onClick={() => setInputMode('custom')}
          className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
            inputMode === 'custom'
              ? 'border-cyan-400 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-slate-300'
          }`}
        >
          Custom Input
        </button>
      </div>

      <Tabs value={contentType} onValueChange={(v) => { setContentType(v); setSelectedItem(null); setFilterLevel('all'); }}>
        <TabsList className="grid grid-cols-3 bg-slate-800/50 w-full">
          <TabsTrigger value="text" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 text-xs">
            <Type className="w-3.5 h-3.5 mr-1.5" /> Text
          </TabsTrigger>
          <TabsTrigger value="image" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400 text-xs">
            <Image className="w-3.5 h-3.5 mr-1.5" /> Image
          </TabsTrigger>
          <TabsTrigger value="audio" className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400 text-xs">
            <Mic className="w-3.5 h-3.5 mr-1.5" /> Audio
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {inputMode === 'sample' ? (
        <>
          <div className="flex flex-wrap gap-1.5">
            {['all', '1', '2', '3', '4', '5'].map((l) => (
              <button key={l} onClick={() => { setFilterLevel(l); setSelectedItem(null); }}
                className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
                  filterLevel === l
                    ? l === 'all' ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400'
                      : `${LEVEL_COLORS[parseInt(l)]?.bg} ${LEVEL_COLORS[parseInt(l)]?.border} ${LEVEL_COLORS[parseInt(l)]?.text}`
                    : 'bg-slate-800/50 border-slate-700/50 text-slate-500 hover:text-slate-300'
                }`}>
                {l === 'all' ? 'All' : LEVEL_COLORS[parseInt(l)]?.label}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto pr-1">
            <AnimatePresence>
              {filteredItems.map((item) => {
                const lc = LEVEL_COLORS[item.level];
                const isSelected = selectedItem?.id === item.id;
                return (
                  <motion.button key={item.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    onClick={() => setSelectedItem(isSelected ? null : item)}
                    className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all ${
                      isSelected ? `${lc.bg} ${lc.border} ring-1 ring-offset-0 ring-current` : 'bg-slate-800/30 border-slate-700/30 hover:border-slate-600/50'
                    }`}>
                    <div className="flex items-start justify-between gap-2">
                      <span className={`font-medium ${isSelected ? lc.text : 'text-slate-300'} leading-snug`}>{item.content}</span>
                      <span className={`shrink-0 px-1.5 py-0.5 rounded text-[10px] font-bold ${lc.bg} ${lc.text} border ${lc.border}`}>L{item.level}</span>
                    </div>
                    <div className="mt-1 text-slate-500">{item.id} · score: {item.negativity_score}</div>
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>
          <AnimatePresence>
            {selectedItem && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                className={`p-3 rounded-lg border ${LEVEL_COLORS[selectedItem.level]?.bg} ${LEVEL_COLORS[selectedItem.level]?.border}`}>
                <div className="text-xs text-slate-400 mb-1">Selected:</div>
                <div className={`text-sm font-medium ${LEVEL_COLORS[selectedItem.level]?.text}`}>{selectedItem.content}</div>
                <div className="text-xs text-slate-500 mt-1">Category: {selectedItem.category} · Score: {selectedItem.negativity_score}</div>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={pickRandom} disabled={isProcessing} className="border-slate-700 text-slate-300 hover:bg-slate-700 text-xs">
              <Shuffle className="w-3.5 h-3.5 mr-1.5" /> Random
            </Button>
            <Button onClick={handleSampleSubmit} disabled={isProcessing || !selectedItem} size="sm"
              className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white text-xs">
              {isProcessing ? <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />Analyzing...</> : <><Send className="w-3.5 h-3.5 mr-1.5" />Submit</>}
            </Button>
          </div>
        </>
      ) : (
        <>
          <textarea
            value={customContent}
            onChange={(e) => setCustomContent(e.target.value)}
            placeholder="Enter your custom content to analyze..."
            className="w-full p-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 resize-none"
            rows={4}
            disabled={isProcessing}
          />
          
          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-300">
              Category: <span className="text-slate-500">({customCategory})</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCustomCategory(cat)}
                  className={`px-3 py-1.5 rounded text-xs font-medium border transition-all ${
                    customCategory === cat
                      ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400'
                      : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:text-slate-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-slate-300">
                Negativity Score
              </label>
              <span className={`text-sm font-bold ${
                customScore <= 20 ? 'text-green-400' :
                customScore <= 40 ? 'text-blue-400' :
                customScore <= 60 ? 'text-yellow-400' :
                customScore <= 80 ? 'text-orange-400' :
                'text-red-400'
              }`}>
                {customScore}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={customScore}
              onChange={(e) => setCustomScore(Number(e.target.value))}
              disabled={isProcessing}
              className="w-full h-2 bg-slate-800/50 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
            <div className="flex justify-between text-xs text-slate-500">
              <span>Safe</span>
              <span>Extreme</span>
            </div>
          </div>

          <Button
            onClick={handleCustomSubmit}
            disabled={isProcessing || !customContent.trim()}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white text-xs"
          >
            {isProcessing ? <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />Analyzing...</> : <><Send className="w-3.5 h-3.5 mr-1.5" />Submit Custom</>}
          </Button>
        </>
      )}
    </motion.div>
  );
}