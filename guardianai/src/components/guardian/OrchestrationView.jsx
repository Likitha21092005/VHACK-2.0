import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AICore from './AICore';
import { Eye, ShieldOff, BarChart2 } from 'lucide-react';

const AGENTS = [
  { id: 'perception', label: 'Perception Agent', sublabel: 'Analyses input content', icon: Eye, color: '#22d3ee', },
  { id: 'autoremove', label: 'Auto-Remove Agent', sublabel: 'Enforces removal rules', icon: ShieldOff, color: '#ef4444', },
  { id: 'scoring', label: 'Scoring Agent', sublabel: 'Calculates analytics', icon: BarChart2, color: '#a78bfa', },
];

function ChargingDots({ color, direction }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full"
          style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }}
          initial={{ [direction === 'right' ? 'left' : 'right']: '0%', opacity: 0 }}
          animate={{
            [direction === 'right' ? 'left' : 'right']: ['0%', '80%', '100%'],
            opacity: [0, 1, 0],
            scale: [0.5, 1.2, 0.5],
          }}
          transition={{ duration: 1.2, delay: i * 0.25, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

function AgentCard({ agent, isActive }) {
  return (
    <motion.div
      className="relative flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-sm w-full"
      style={{
        background: isActive ? `linear-gradient(135deg, ${agent.color}18, rgba(15,23,42,0.95))` : 'rgba(15,23,42,0.85)',
        borderColor: isActive ? agent.color : `${agent.color}25`,
        boxShadow: isActive ? `0 0 18px ${agent.color}35` : 'none',
      }}
      animate={{ scale: isActive ? 1.03 : 1 }}
      transition={{ duration: 0.25 }}
    >
      <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: `${agent.color}18`, border: `1px solid ${agent.color}40` }}>
        <agent.icon className="w-4 h-4" style={{ color: agent.color }} />
      </div>
      <div className="min-w-0">
        <div className="text-xs font-semibold text-white leading-tight">{agent.label}</div>
        <div className="text-[10px] text-slate-500 mt-0.5">{agent.sublabel}</div>
      </div>
      <motion.div
        className="absolute top-2 right-2 w-2 h-2 rounded-full shrink-0"
        style={{ backgroundColor: agent.color }}
        animate={{ opacity: isActive ? [0.4, 1, 0.4] : 0.3, scale: isActive ? [1, 1.4, 1] : 1 }}
        transition={{ duration: 0.8, repeat: isActive ? Infinity : 0 }}
      />
    </motion.div>
  );
}

function ModeratorSlot({ mod, isReceiving, dataId }) {
  const getStatusColor = () => {
    if (mod.status === 'on_break') return '#ef4444';
    if (mod.status === 'restricted') return '#f97316';
    return '#10b981';
  };
  const color = getStatusColor();

  return (
    <motion.div
      data-moderator-id={dataId}
      className="relative flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-sm w-full"
      style={{
        background: isReceiving ? 'rgba(34,211,238,0.08)' : mod.status === 'on_break' ? 'rgba(239,68,68,0.06)' : 'rgba(15,23,42,0.85)',
        borderColor: isReceiving ? '#22d3ee' : `${color}30`,
        boxShadow: isReceiving ? '0 0 20px rgba(34,211,238,0.4)' : 'none',
      }}
      animate={{ scale: isReceiving ? 1.04 : 1 }}
      transition={{ duration: 0.25 }}
    >
      <AnimatePresence>
        {isReceiving && (
          <motion.div className="absolute inset-0 rounded-xl bg-cyan-400/15"
            initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0] }} exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }} />
        )}
      </AnimatePresence>
      <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 font-bold text-sm"
        style={{ background: `${color}18`, border: `1px solid ${color}40`, color }}>
        {mod.name?.charAt(mod.name.length - 1) || '?'}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-semibold text-white">{mod.name}</div>
        <div className="flex items-center gap-2 mt-1">
          <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden" style={{ maxWidth: 60 }}>
            <motion.div className="h-full rounded-full"
              style={{ backgroundColor: mod.current_score >= 40 ? '#ef4444' : mod.current_score >= 20 ? '#f97316' : '#22d3ee' }}
              animate={{ width: `${Math.min((mod.current_score || 0) / 40 * 100, 100)}%` }}
              transition={{ duration: 0.4 }} />
          </div>
          <span className="text-[10px] text-slate-400 font-mono">{mod.current_score || 0}/40</span>
        </div>
      </div>
      <div className="text-right shrink-0">
        <div className="text-[10px] font-medium capitalize" style={{ color }}>{mod.status?.replace('_', ' ')}</div>
        <div className="text-[10px] text-slate-500">{mod.task_count || 0} tasks</div>
      </div>
    </motion.div>
  );
}

export default function OrchestrationView({ isAnalyzing, negativityScore, currentAgent, moderators, activeStream, streamSeverity, processingStage }) {
  const containerRef = useRef(null);
  const [streamPath, setStreamPath] = useState(null);

  const getSeverityColor = (s) => {
    if (!s || s <= 1) return '#10b981';
    if (s <= 2) return '#84cc16';
    if (s <= 3) return '#eab308';
    if (s <= 4) return '#f97316';
    return '#ef4444';
  };

  useEffect(() => {
    if (activeStream && containerRef.current) {
      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();
      const cx = container.offsetWidth / 2;
      const cy = container.offsetHeight / 2;
      const el = container.querySelector(`[data-moderator-id="${activeStream}"]`);
      if (el) {
        const r = el.getBoundingClientRect();
        const tx = r.left - containerRect.left + r.width / 2;
        const ty = r.top - containerRect.top + r.height / 2;
        setStreamPath({ x1: cx, y1: cy, x2: tx, y2: ty });
      }
    } else {
      setStreamPath(null);
    }
  }, [activeStream]);

  const activeAgentId = isAnalyzing
    ? processingStage === 'perception' ? 'perception'
    : processingStage === 'evaluation' ? 'autoremove'
    : processingStage === 'routing' ? 'scoring'
    : null : null;

  const displayMods = moderators.slice(0, 3);

  return (
    <div ref={containerRef} className="relative w-full rounded-2xl border border-slate-700/50 overflow-hidden"
      style={{ background: 'linear-gradient(135deg, rgba(2,6,23,0.97) 0%, rgba(15,23,42,0.97) 100%)', minHeight: 380 }}>

      {/* Grid BG */}
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none">
        <svg width="100%" height="100%">
          <defs><pattern id="grid3" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#22d3ee" strokeWidth="0.8" />
          </pattern></defs>
          <rect width="100%" height="100%" fill="url(#grid3)" />
        </svg>
      </div>

      {/* Stream SVG */}
      <AnimatePresence>
        {streamPath && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-20" style={{ overflow: 'visible' }}>
            <defs>
              <filter id="glow3">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            <motion.path
              d={`M ${streamPath.x1} ${streamPath.y1} C ${streamPath.x1 + 60} ${streamPath.y1}, ${streamPath.x2 - 60} ${streamPath.y2}, ${streamPath.x2} ${streamPath.y2}`}
              stroke={getSeverityColor(streamSeverity)} strokeWidth="2" fill="none" filter="url(#glow3)"
              strokeDasharray="6 4"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
            />
            {[0, 0.3, 0.6, 1].map((t, i) => {
              const bx = streamPath.x1*(1-t)**3 + 3*(streamPath.x1+60)*(1-t)**2*t + 3*(streamPath.x2-60)*(1-t)*t**2 + streamPath.x2*t**3;
              const by = streamPath.y1*(1-t)**3 + 3*streamPath.y1*(1-t)**2*t + 3*streamPath.y2*(1-t)*t**2 + streamPath.y2*t**3;
              return (
                <motion.circle key={i} cx={bx} cy={by} r="5" fill={getSeverityColor(streamSeverity)} filter="url(#glow3)"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: [0, 1, 0], scale: [0, 1.3, 0] }}
                  transition={{ duration: 0.9, delay: i * 0.15, repeat: 1 }} />
              );
            })}
          </svg>
        )}
      </AnimatePresence>

      {/* 3-column layout */}
      <div className="relative z-10 grid grid-cols-[220px_1fr_220px] h-full" style={{ minHeight: 380 }}>

        {/* LEFT — Agents */}
        <div className="flex flex-col justify-center gap-3 p-5">
          <div className="text-[10px] uppercase tracking-[0.15em] text-slate-500 font-semibold mb-1 text-center">AI Agents</div>
          {AGENTS.map((agent) => {
            const isActive = activeAgentId === agent.id;
            return (
              <div key={agent.id} className="relative">
                <AgentCard agent={agent} isActive={isActive} />
                {isActive && (
                  <div className="absolute top-1/2 -translate-y-1/2 right-0 translate-x-full h-0.5 w-8 overflow-visible" style={{ zIndex: 30 }}>
                    <ChargingDots color={agent.color} direction="right" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* CENTER — AI Core */}
        <div className="flex flex-col items-center justify-center relative py-8">
          <div className="text-[10px] uppercase tracking-[0.15em] text-slate-500 font-semibold mb-8">Neural Core</div>
          <AICore isAnalyzing={isAnalyzing} negativityScore={negativityScore} currentAgent={currentAgent} />
        </div>

        {/* RIGHT — Moderators */}
        <div className="flex flex-col justify-center gap-3 p-5">
          <div className="text-[10px] uppercase tracking-[0.15em] text-slate-500 font-semibold mb-1 text-center">Moderators</div>
          {displayMods.map((mod) => (
            <div key={mod.id} className="relative">
              {activeStream === mod.id && (
                <div className="absolute top-1/2 -translate-y-1/2 left-0 -translate-x-full h-0.5 w-8 overflow-visible" style={{ zIndex: 30 }}>
                  <ChargingDots color={getSeverityColor(streamSeverity)} direction="left" />
                </div>
              )}
              <ModeratorSlot mod={mod} isReceiving={activeStream === mod.id} dataId={mod.id} />
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-5 text-[10px]">
        {[{ color: '#10b981', label: 'Active' }, { color: '#f97316', label: 'Restricted' }, { color: '#ef4444', label: 'On Break' }].map(l => (
          <div key={l.label} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: l.color }} />
            <span className="text-slate-400">{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}