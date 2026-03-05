import React from 'react';
import { motion } from 'framer-motion';
import { User, Coffee, AlertCircle, CheckCircle, Clock } from 'lucide-react';

export default function ModeratorCard({ moderator, isReceivingTask }) {
  const getStatusColor = () => {
    if (moderator.status === 'on_break') return '#ef4444';
    if (moderator.status === 'restricted') return '#f97316';
    return '#10b981';
  };

  const getScoreBarColor = () => {
    if (moderator.current_score >= 40) return 'bg-red-500';
    if (moderator.current_score >= 20) return 'bg-orange-500';
    return 'bg-cyan-500';
  };

  return (
    <motion.div className="relative" data-moderator-id={moderator.id}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1,
        boxShadow: isReceivingTask ? '0 0 40px rgba(34, 211, 238, 0.6)' :
          moderator.status === 'on_break' ? '0 0 20px rgba(239, 68, 68, 0.3)' : '0 0 20px rgba(0,0,0,0.2)'
      }}
      transition={{ duration: 0.3 }}>
      <div className="relative p-3 rounded-xl backdrop-blur-sm border overflow-hidden w-44"
        style={{
          background: 'linear-gradient(135deg, rgba(15,23,42,0.9) 0%, rgba(30,41,59,0.9) 100%)',
          borderColor: isReceivingTask ? '#22d3ee' : `${getStatusColor()}40`,
        }}>
        {isReceivingTask && (
          <motion.div className="absolute inset-0 bg-cyan-400/20"
            initial={{ opacity: 0 }} animate={{ opacity: [0, 0.5, 0] }} transition={{ duration: 0.5 }} />
        )}
        <div className="absolute top-3 right-3">
          <motion.div className="w-3 h-3 rounded-full" style={{ backgroundColor: getStatusColor() }}
            animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }} />
        </div>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${getStatusColor()}30, ${getStatusColor()}10)`, border: `1px solid ${getStatusColor()}50` }}>
            {moderator.status === 'on_break'
              ? <Coffee className="w-5 h-5" style={{ color: getStatusColor() }} />
              : <User className="w-5 h-5" style={{ color: getStatusColor() }} />}
          </div>
          <div>
            <div className="font-semibold text-white text-sm">{moderator.name}</div>
            <div className="text-xs capitalize" style={{ color: getStatusColor() }}>{moderator.status?.replace('_', ' ')}</div>
          </div>
        </div>
        <div className="mb-3">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-400">Fatigue Score</span>
            <span className="font-mono text-white">{moderator.current_score || 0}/40</span>
          </div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <motion.div className={`h-full ${getScoreBarColor()} rounded-full`}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((moderator.current_score || 0) / 40 * 100, 100)}%` }}
              transition={{ duration: 0.5 }} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-slate-400">
            <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />
            <span>{moderator.task_count || 0} tasks</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <Coffee className="w-3.5 h-3.5 text-orange-400" />
            <span>{moderator.break_count || 0} breaks</span>
          </div>
        </div>
        {moderator.current_score >= 20 && moderator.current_score < 40 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="mt-3 px-2 py-1 rounded-md bg-orange-500/10 border border-orange-500/30 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-orange-400" />
            <span className="text-xs text-orange-400">Restricted Mode</span>
          </motion.div>
        )}
        {moderator.status === 'on_break' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="mt-3 px-2 py-1 rounded-md bg-red-500/10 border border-red-500/30 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-red-400" />
            <span className="text-xs text-red-400">Cooldown Active</span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
