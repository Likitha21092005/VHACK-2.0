import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Calendar, Users, FolderOpen, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { format } from 'date-fns';

export default function ReportsPanel({ analytics, moderators, retrainingLogs, onExport }) {
  const [activeReport, setActiveReport] = useState('daily');

  const dailyStats = {
    date: format(new Date(), 'MMMM d, yyyy'),
    totalInputs: analytics?.total_inputs || 0,
    autoRemoved: analytics?.auto_removed_count || 0,
    moderated: analytics?.moderation_count || 0,
    breakEvents: analytics?.total_break_events || 0,
    avgProcessingTime: analytics?.avg_processing_time_ms || 0,
  };

  const categoryStats = [
    { name: 'Safe', count: analytics?.category_safe || 0, autoRemoveRate: 0 },
    { name: 'Complaint', count: analytics?.category_complaint || 0, autoRemoveRate: 5 },
    { name: 'Harassment', count: analytics?.category_harassment || 0, autoRemoveRate: 30 },
    { name: 'Abuse', count: analytics?.category_abuse || 0, autoRemoveRate: 60 },
    { name: 'Threat', count: analytics?.category_threat || 0, autoRemoveRate: 90 },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-cyan-400" />
          Reports
        </h3>
        <Button size="sm" variant="outline" onClick={() => onExport?.(activeReport)}
          className="text-xs border-slate-600 text-slate-300 hover:bg-slate-700">
          <Download className="w-3.5 h-3.5 mr-1.5" /> Export
        </Button>
      </div>

      <Tabs value={activeReport} onValueChange={setActiveReport}>
        <TabsList className="grid grid-cols-4 bg-slate-800/50 mb-4">
          <TabsTrigger value="daily" className="text-xs data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
            <Calendar className="w-3.5 h-3.5 mr-1.5" /> Daily
          </TabsTrigger>
          <TabsTrigger value="moderators" className="text-xs data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
            <Users className="w-3.5 h-3.5 mr-1.5" /> Mods
          </TabsTrigger>
          <TabsTrigger value="categories" className="text-xs data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
            <FolderOpen className="w-3.5 h-3.5 mr-1.5" /> Cat.
          </TabsTrigger>
          <TabsTrigger value="retraining" className="text-xs data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
            <Database className="w-3.5 h-3.5 mr-1.5" /> Data
          </TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="space-y-4">
          <div className="text-sm text-slate-400 mb-4">{dailyStats.date}</div>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
              <div className="text-2xl font-bold text-white">{dailyStats.totalInputs}</div>
              <div className="text-xs text-slate-400">Total Inputs</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
              <div className="text-2xl font-bold text-red-400">{dailyStats.autoRemoved}</div>
              <div className="text-xs text-slate-400">Auto Removed</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
              <div className="text-2xl font-bold text-green-400">{dailyStats.moderated}</div>
              <div className="text-xs text-slate-400">Moderated</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
              <div className="text-2xl font-bold text-orange-400">{dailyStats.breakEvents}</div>
              <div className="text-xs text-slate-400">Break Events</div>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/30 flex items-center justify-between">
            <span className="text-sm text-slate-400">Avg. Processing Time</span>
            <span className="text-sm font-mono text-cyan-400">{dailyStats.avgProcessingTime.toFixed(0)}ms</span>
          </div>
        </TabsContent>

        <TabsContent value="moderators" className="space-y-3">
          {moderators.map((mod) => (
            <div key={mod.id} className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-white text-sm">{mod.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  mod.status === 'active' ? 'bg-green-500/20 text-green-400' :
                  mod.status === 'restricted' ? 'bg-orange-500/20 text-orange-400' : 'bg-red-500/20 text-red-400'
                }`}>{mod.status}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div><span className="text-slate-500">Tasks</span><div className="text-slate-300 font-medium">{mod.task_count || 0}</div></div>
                <div><span className="text-slate-500">Score</span><div className="text-slate-300 font-medium">{mod.current_score || 0}</div></div>
                <div><span className="text-slate-500">Breaks</span><div className="text-slate-300 font-medium">{mod.break_count || 0}</div></div>
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="categories" className="space-y-3">
          {categoryStats.map((cat) => (
            <div key={cat.name} className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-white">{cat.name}</span>
                <div className="text-xs text-slate-400">{cat.count} items</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-slate-300">{cat.autoRemoveRate}%</div>
                <div className="text-xs text-slate-500">Auto-remove rate</div>
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="retraining" className="space-y-3">
          <div className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/30 text-center">
            <Database className="w-8 h-8 mx-auto mb-2 text-cyan-400" />
            <div className="text-2xl font-bold text-white">{retrainingLogs?.length || 0}</div>
            <div className="text-sm text-slate-400 mb-4">Records in Retraining Dataset</div>
            <Button size="sm" onClick={() => onExport?.('retraining')}
              className="bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 border border-cyan-500/30">
              <Download className="w-3.5 h-3.5 mr-1.5" /> Export Dataset
            </Button>
          </div>
          <p className="text-xs text-slate-500 text-center">
            All processed content is automatically logged for continuous AI model improvement.
          </p>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}