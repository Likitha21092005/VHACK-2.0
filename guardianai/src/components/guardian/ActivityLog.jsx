
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldOff, UserCheck, AlertTriangle, Coffee, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';

export default function ActivityLog({ activities }) {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'auto_remove': return <ShieldOff className="w-4 h-4 text-red-400" />;
      case 'assigned': return <UserCheck className="w-4 h-4 text-cyan-400" />;
      case 'break_started': return <Coffee className="w-4 h-4 text-orange-400" />;
      case 'break_ended': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'moderated': return <CheckCircle className="w-4 h-4 text-green-400" />;
      default: return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'auto_remove': return 'border-red-500/30 bg-red-500/5';
      case 'assigned': return 'border-cyan-500/30 bg-cyan-500/5';
      case 'break_started': return 'border-orange-500/30 bg-orange-500/5';
      case 'break_ended': return 'border-green-500/30 bg-green-500/5';
      case 'moderated': return 'border-green-500/30 bg-green-500/5';
      default: return 'border-slate-500/30 bg-slate-500/5';
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        Activity Log
      </h3>
      <div className="space-y-2 max-h-[300px] overflow-y-auto">
        <AnimatePresence>
          {activities.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-sm">No activity yet</div>
          ) : (
            activities.map((activity, index) => (
              <motion.div key={activity.id || index} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }} transition={{ delay: index * 0.05 }}
                className={`p-3 rounded-lg border ${getActivityColor(activity.type)}`}>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">{getActivityIcon(activity.type)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white">{activity.message}</p>
                    {activity.details && <p className="text-xs text-slate-400 mt-1 truncate">{activity.details}</p>}
                    <p className="text-xs text-slate-500 mt-1">
                      {activity.timestamp ? format(new Date(activity.timestamp), 'HH:mm:ss') : 'Just now'}
                    </p>
                  </div>
                  {activity.severity && (
                    <div className={`px-2 py-0.5 rounded text-xs font-medium ${
                      activity.severity > 4 ? 'bg-red-500/20 text-red-400' :
                      activity.severity > 2 ? 'bg-orange-500/20 text-orange-400' : 'bg-green-500/20 text-green-400'
                    }`}>L{activity.severity}</div>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
