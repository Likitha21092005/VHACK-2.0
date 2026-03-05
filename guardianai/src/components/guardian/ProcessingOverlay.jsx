import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Eye, Ear, Type, Shield, UserCheck } from 'lucide-react';

export default function ProcessingOverlay({ isVisible, stage, contentType }) {
  function getContentIcon(type) {
    switch (type) {
      case 'image': return Eye;
      case 'audio': return Ear;
      default: return Type;
    }
  }

  const stages = [
    { id: 'receiving', label: 'Receiving Content', icon: getContentIcon(contentType) },
    { id: 'perception', label: 'Perception Analysis', icon: Brain },
    { id: 'evaluation', label: 'Negativity Evaluation', icon: Shield },
    { id: 'routing', label: 'Routing Decision', icon: UserCheck },
  ];

  const currentIndex = stages.findIndex(s => s.id === stage);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
            className="p-8 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 max-w-md w-full mx-4">
            <div className="text-center mb-8">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="w-16 h-16 mx-auto mb-4 rounded-full bg-cyan-500/20 flex items-center justify-center">
                <Brain className="w-8 h-8 text-cyan-400" />
              </motion.div>
              <h3 className="text-xl font-semibold text-white">Processing Content</h3>
              <p className="text-sm text-slate-400 mt-1">Multi-agent analysis in progress</p>
            </div>
            <div className="space-y-3">
              {stages.map((s, index) => {
                const Icon = s.icon;
                const isActive = index === currentIndex;
                const isComplete = index < currentIndex;
                return (
                  <motion.div key={s.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                      isActive ? 'border-cyan-500/50 bg-cyan-500/10' :
                      isComplete ? 'border-green-500/30 bg-green-500/5' : 'border-slate-700/50 bg-slate-800/30'
                    }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isActive ? 'bg-cyan-500/20' : isComplete ? 'bg-green-500/20' : 'bg-slate-700/50'
                    }`}>
                      {isActive ? (
                        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.5, repeat: Infinity }}>
                          <Icon className="w-4 h-4 text-cyan-400" />
                        </motion.div>
                      ) : (
                        <Icon className={`w-4 h-4 ${isComplete ? 'text-green-400' : 'text-slate-500'}`} />
                      )}
                    </div>
                    <div className="flex-1">
                      <span className={`text-sm ${isActive ? 'text-cyan-400' : isComplete ? 'text-green-400' : 'text-slate-400'}`}>
                        {s.label}
                      </span>
                    </div>
                    {isActive && (
                      <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1, repeat: Infinity }}
                        className="text-xs text-cyan-400">Processing...</motion.div>
                    )}
                    {isComplete && <div className="text-xs text-green-400">✓</div>}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}