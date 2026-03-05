import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, ShieldOff, CheckCircle2, Users, TrendingUp, Coffee, AlertTriangle, Clock
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function AnalyticsPanel({ analytics, moderators }) {
  const categoryData = [
    { name: 'Safe', value: analytics?.category_safe || 0, color: '#10b981' },
    { name: 'Complaint', value: analytics?.category_complaint || 0, color: '#3b82f6' },
    { name: 'Harassment', value: analytics?.category_harassment || 0, color: '#f97316' },
    { name: 'Abuse', value: analytics?.category_abuse || 0, color: '#ef4444' },
    { name: 'Threat', value: analytics?.category_threat || 0, color: '#7c3aed' },
  ].filter(d => d.value > 0);

  const stats = [
    { label: 'Total Inputs', value: analytics?.total_inputs || 0, icon: BarChart3, color: 'text-cyan-400', bgColor: 'bg-cyan-400/10' },
    { label: 'Auto Removed', value: analytics?.auto_removed_count || 0, icon: ShieldOff, color: 'text-red-400', bgColor: 'bg-red-400/10' },
    { label: 'Moderated', value: analytics?.moderation_count || 0, icon: CheckCircle2, color: 'text-green-400', bgColor: 'bg-green-400/10' },
    { label: 'Break Events', value: analytics?.total_break_events || 0, icon: Coffee, color: 'text-orange-400', bgColor: 'bg-orange-400/10' },
  ];

  const activeModerators = moderators?.filter(m => m.status === 'active').length || 0;
  const restrictedModerators = moderators?.filter(m => m.status === 'restricted').length || 0;
  const onBreakModerators = moderators?.filter(m => m.status === 'on_break').length || 0;

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
      className="p-6 rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-cyan-400" />
        Live Analytics
      </h3>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <div className={`w-8 h-8 rounded-lg ${stat.bgColor} flex items-center justify-center mb-2`}>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <div className="text-xs text-slate-400">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="mb-6 p-4 rounded-xl bg-slate-800/30 border border-slate-700/30">
        <div className="flex items-center gap-2 mb-3">
          <Users className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-medium text-slate-300">Moderator Status</span>
        </div>
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-slate-400">Active: {activeModerators}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-orange-500" />
            <span className="text-slate-400">Restricted: {restrictedModerators}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-slate-400">Break: {onBreakModerators}</span>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/30">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-medium text-slate-300">Category Distribution</span>
        </div>
        {categoryData.length > 0 ? (
          <div className="flex items-center gap-4">
            <div className="w-24 h-24">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryData} dataKey="value" cx="50%" cy="50%" innerRadius={25} outerRadius={40} paddingAngle={2}>
                    {categoryData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-1">
              {categoryData.map((cat) => (
                <div key={cat.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span className="text-slate-400">{cat.name}</span>
                  </div>
                  <span className="text-white font-medium">{cat.value}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-4 text-slate-500 text-sm">No data yet</div>
        )}
      </div>

      {analytics?.avg_processing_time_ms > 0 && (
        <div className="mt-4 flex items-center justify-between p-3 rounded-lg bg-slate-800/30">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Clock className="w-4 h-4" />
            Avg. Processing Time
          </div>
          <span className="text-sm font-mono text-cyan-400">{analytics.avg_processing_time_ms.toFixed(0)}ms</span>
        </div>
      )}
    </motion.div>
  );
}
