
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, AlertTriangle } from 'lucide-react';

export default function AICore({ isAnalyzing, negativityScore, currentAgent }) {
  const getScoreColor = () => {
    if (negativityScore === null) return 'cyan';
    if (negativityScore <= 20) return '#10b981';
    if (negativityScore <= 40) return '#84cc16';
    if (negativityScore <= 60) return '#eab308';
    if (negativityScore <= 70) return '#f97316';
    return '#ef4444';
  };

  return (
    <div className="relative flex items-center justify-center">
      <motion.div className="absolute w-64 h-64 rounded-full"
        style={{ background: `radial-gradient(circle, ${getScoreColor()}15 0%, transparent 70%)` }}
        animate={{ scale: isAnalyzing ? [1, 1.2, 1] : 1, opacity: isAnalyzing ? [0.5, 1, 0.5] : 0.3 }}
        transition={{ duration: 2, repeat: isAnalyzing ? Infinity : 0 }} />

      <motion.div className="absolute w-52 h-52 rounded-full border-2"
        style={{ borderColor: `${getScoreColor()}40` }}
        animate={{ rotate: 360, scale: isAnalyzing ? [1, 1.05, 1] : 1 }}
        transition={{ rotate: { duration: 20, repeat: Infinity, ease: 'linear' }, scale: { duration: 1, repeat: isAnalyzing ? Infinity : 0 } }} />

      <AnimatePresence>
        {isAnalyzing && [...Array(8)].map((_, i) => (
          <motion.div key={i} className="absolute w-2 h-2 rounded-full"
            style={{ backgroundColor: getScoreColor() }}
            initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
            animate={{ x: Math.cos(i * Math.PI / 4) * 100, y: Math.sin(i * Math.PI / 4) * 100, opacity: [0, 1, 0], scale: [0, 1, 0] }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.15, ease: 'easeOut' }} />
        ))}
      </AnimatePresence>

      <motion.div className="relative w-40 h-40 rounded-full flex items-center justify-center"
        style={{
          background: `linear-gradient(135deg, ${getScoreColor()}20 0%, #0f172a 50%, ${getScoreColor()}10 100%)`,
          boxShadow: `0 0 60px ${getScoreColor()}30, inset 0 0 40px ${getScoreColor()}10`,
        }}
        animate={{ boxShadow: isAnalyzing ? [`0 0 60px ${getScoreColor()}30`, `0 0 100px ${getScoreColor()}60`, `0 0 60px ${getScoreColor()}30`] : `0 0 60px ${getScoreColor()}30` }}
        transition={{ duration: 1.5, repeat: isAnalyzing ? Infinity : 0 }}>
        <motion.div className="absolute w-32 h-32 rounded-full border"
          style={{ borderColor: `${getScoreColor()}30` }}
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }} />
        <motion.div animate={{ scale: isAnalyzing ? [1, 1.1, 1] : 1 }} transition={{ duration: 0.5, repeat: isAnalyzing ? Infinity : 0 }}>
          {negativityScore !== null && negativityScore > 70
            ? <AlertTriangle className="w-12 h-12" style={{ color: getScoreColor() }} />
            : <Brain className="w-12 h-12" style={{ color: getScoreColor() }} />}
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {negativityScore !== null && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="absolute -bottom-16 text-center">
            <div className="text-xs uppercase tracking-widest text-slate-500 mb-1">Negativity Score</div>
            <motion.div className="text-4xl font-bold" style={{ color: getScoreColor() }}
              animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 0.3 }}>
              {negativityScore}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {currentAgent && (
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
            className="absolute -top-8 px-3 py-1 rounded-full text-xs font-medium"
            style={{ backgroundColor: `${getScoreColor()}20`, color: getScoreColor(), border: `1px solid ${getScoreColor()}40` }}>
            {currentAgent}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}