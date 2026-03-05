import { useState, useCallback, useEffect } from 'react';
import { Shield, RefreshCw } from 'lucide-react';
import { Button } from '../components/ui/button';
import ProcessingOverlay from '../components/guardian/ProcessingOverlay';
import OrchestrationView from '../components/guardian/OrchestrationView';
import ContentInput from '../components/guardian/ContentInput';
import ActivityLog from '../components/guardian/ActivityLog';
import AnalyticsPanel from '../components/guardian/AnalyticsPanel';
import ReportsPanel from '../components/guardian/ReportsPanel';

// Constants
const THRESHOLD_1 = 40;
const THRESHOLD_2 = 80;
const BREAK_COOLDOWN_MS = 3000;

// Simple in-memory mockStore
const mockStore = {
  moderators: [],
  submissions: [],
  activities: [],
  analyticsData: null,
  retrainingLogs: [],
  
  async getModerators() {
    if (this.moderators.length === 0) {
      const today = new Date().toISOString().split('T')[0];
      this.analyticsData = { id: 1, date: today, total_inputs: 0, auto_removed_count: 0, moderation_count: 0, category_safe: 0, category_complaint: 0, category_harassment: 0, category_abuse: 0, category_threat: 0, total_break_events: 0, avg_processing_time_ms: 0 };
      this.moderators = [
        { id: 1, name: 'Moderator A', status: 'active', current_score: 0, task_count: 0, break_count: 0, specialization: 'general' },
        { id: 2, name: 'Moderator B', status: 'active', current_score: 0, task_count: 0, break_count: 0, specialization: 'general' },
        { id: 3, name: 'Moderator C', status: 'active', current_score: 0, task_count: 0, break_count: 0, specialization: 'general' },
      ];
    }
    return this.moderators;
  },
  
  updateModerator(id, updates) {
    const mod = this.moderators.find(m => m.id === id);
    if (mod) Object.assign(mod, updates);
    return mod;
  },
  
  getAnalytics() {
    return this.analyticsData;
  },
  
  updateAnalytics(updates) {
    if (this.analyticsData) Object.assign(this.analyticsData, updates);
  },
  
  addActivity(activity) {
    this.activities.unshift({ ...activity, id: Date.now() });
  },
  
  addRetrainingLog(log) {
    this.retrainingLogs.unshift(log);
  },
};

export default function Dashboard() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState(null);
  const [currentContentType, setCurrentContentType] = useState(null);
  const [negativityScore, setNegativityScore] = useState(null);
  const [currentAgent, setCurrentAgent] = useState(null);
  const [activeStream, setActiveStream] = useState(null);
  const [streamSeverity, setStreamSeverity] = useState(null);
  const [activities, setActivities] = useState([]);
  const [moderators, setModerators] = useState([]);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [retrainingLogs, setRetrainingLogs] = useState([]);

  // Initialize
  useEffect(() => {
    const init = async () => {
      const mods = await mockStore.getModerators();
      setModerators([...mods]);
      setAnalyticsData({ ...mockStore.analyticsData });
    };
    init();
  }, []);

  const addActivity = useCallback((type, message, details = null, severity = null) => {
    const activity = { type, message, details, severity, timestamp: new Date().toISOString() };
    mockStore.addActivity(activity);
    setActivities(prev => [activity, ...prev].slice(0, 50));
  }, []);

  const calculateSeverityLevel = (score) => {
    if (score <= 20) return 1;
    if (score <= 40) return 2;
    if (score <= 60) return 3;
    if (score <= 70) return 4;
    return 5;
  };

  const selectModerator = useCallback((severityLevel, mods) => {
    const availableMods = mods.filter(m => {
      if (m.status === 'on_break') return false;
      if (m.status === 'restricted' && severityLevel >= 2) return false;
      return true;
    });
    if (availableMods.length === 0) return null;
    return availableMods.sort((a, b) => (a.current_score || 0) - (b.current_score || 0))[0];
  }, []);

  const updateModeratorStatus = useCallback(async (moderator, severityLevel) => {
    const newScore = (moderator.current_score || 0) + severityLevel;
    let newStatus = moderator.status;

    if (newScore >= THRESHOLD_2) {
      newStatus = 'on_break';
      addActivity('break_started', `${moderator.name} entering break`, 'Fatigue threshold exceeded');
      setTimeout(async () => {
        mockStore.updateModerator(moderator.id, { current_score: 10, status: 'active', last_break_end: new Date().toISOString() });
        setModerators([...mockStore.moderators]);
        addActivity('break_ended', `${moderator.name} returned from break`, 'Score reset to 10');
      }, BREAK_COOLDOWN_MS);
    } else if (newScore >= THRESHOLD_1) {
      newStatus = 'restricted';
    }

    mockStore.updateModerator(moderator.id, {
      current_score: newScore,
      status: newStatus,
      task_count: (moderator.task_count || 0) + 1,
      break_count: newStatus === 'on_break' ? (moderator.break_count || 0) + 1 : moderator.break_count,
      last_break_start: newStatus === 'on_break' ? new Date().toISOString() : moderator.last_break_start,
    });
    setModerators([...mockStore.moderators]);
  }, [addActivity]);

  const updateAnalytics = useCallback(async (category, isAutoRemoved, processingTime) => {
    if (!analyticsData) return;
    const categoryKey = `category_${category}`;
    const updates = {
      total_inputs: (analyticsData.total_inputs || 0) + 1,
      [categoryKey]: (analyticsData[categoryKey] || 0) + 1,
      avg_processing_time_ms: processingTime,
    };
    if (isAutoRemoved) {
      updates.auto_removed_count = (analyticsData.auto_removed_count || 0) + 1;
    } else {
      updates.moderation_count = (analyticsData.moderation_count || 0) + 1;
    }
    mockStore.updateAnalytics(updates);
    setAnalyticsData({ ...mockStore.analyticsData });
  }, [analyticsData]);

  const processContent = async ({ type, content, url, prefilled }) => {
    const startTime = Date.now();
    setIsProcessing(true);
    setCurrentContentType(type);
    setNegativityScore(null);
    setCurrentAgent(null);
    setActiveStream(null);

    setProcessingStage('receiving');
    await new Promise(r => setTimeout(r, 400));

    setProcessingStage('perception');
    const agentName = type === 'text' ? 'TextAgent' : type === 'image' ? 'ImageAgent' : 'AudioAgent';
    setCurrentAgent(agentName);

    let analysisResult;
    if (prefilled) {
      await new Promise(r => setTimeout(r, 600));
      const categoryMap = { positive: 'safe', complaint: 'complaint', harassment: 'harassment', abuse: 'abuse', threat: 'threat' };
      analysisResult = {
        label: prefilled.level >= 5 ? 'threat' : prefilled.level >= 3 ? 'toxic' : prefilled.level >= 2 ? 'neutral' : 'positive',
        confidence: prefilled.confidence || 0.92,
        category: categoryMap[prefilled.category] || 'safe',
        negativity_score: prefilled.negativity_score,
      };
    } else {
      const baseScore = Math.random() * 100;
      await new Promise(r => setTimeout(r, 800));
      analysisResult = {
        label: baseScore > 70 ? 'threat' : baseScore > 50 ? 'toxic' : baseScore > 30 ? 'neutral' : 'positive',
        confidence: 0.85 + Math.random() * 0.15,
        category: baseScore > 70 ? 'threat' : baseScore > 50 ? 'abuse' : baseScore > 30 ? 'complaint' : 'safe',
        negativity_score: Math.round(baseScore),
      };
    }

    await new Promise(r => setTimeout(r, 500));

    setProcessingStage('evaluation');
    const score = analysisResult.negativity_score;
    setNegativityScore(score);
    const severityLevel = calculateSeverityLevel(score);
    setStreamSeverity(severityLevel);
    await new Promise(r => setTimeout(r, 600));

    setProcessingStage('routing');
    setCurrentAgent('EvaluationAgent');
    const processingTime = Date.now() - startTime;

    if (score > 70) {
      addActivity('auto_remove', 'Content auto-removed', `Score: ${score}, Category: ${analysisResult.category}`, severityLevel);
      await updateAnalytics(analysisResult.category, true, processingTime);
      mockStore.addRetrainingLog({ content_type: type, content_text: content || url || '', original_category: analysisResult.category, negativity_score: score, final_action: 'auto_removed' });
    } else {
      const currentMods = mockStore.moderators;
      const selectedMod = selectModerator(severityLevel, currentMods);
      if (selectedMod) {
        setActiveStream(selectedMod.id);
        await updateModeratorStatus(selectedMod, severityLevel);
        addActivity('assigned', `Assigned to ${selectedMod.name}`, `Severity Level ${severityLevel}`, severityLevel);
        await updateAnalytics(analysisResult.category, false, processingTime);
        mockStore.addRetrainingLog({ content_type: type, content_text: content || url || '', original_category: analysisResult.category, negativity_score: score, final_action: 'approved' });
        setTimeout(() => setActiveStream(null), 1500);
      } else {
        addActivity('queued', 'Content queued', 'No available moderators');
      }
    }

    setRetrainingLogs([...mockStore.retrainingLogs]);

    setTimeout(() => {
      setIsProcessing(false);
      setProcessingStage(null);
      setCurrentAgent(null);
      setTimeout(() => setNegativityScore(null), 2000);
    }, 500);
  };

  const resetSystem = async () => {
    for (const mod of moderators) {
      mockStore.updateModerator(mod.id, { current_score: 0, status: 'active', task_count: 0 });
    }
    if (analyticsData) {
      mockStore.updateAnalytics({
        total_inputs: 0, auto_removed_count: 0, moderation_count: 0,
        category_safe: 0, category_complaint: 0, category_harassment: 0,
        category_abuse: 0, category_threat: 0, total_break_events: 0, avg_processing_time_ms: 0,
      });
      setAnalyticsData({ ...mockStore.analyticsData });
    }
    setModerators([...mockStore.moderators]);
    setActivities([]);
    mockStore.activities = [];
    addActivity('system', 'System reset completed');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <ProcessingOverlay isVisible={isProcessing} stage={processingStage} contentType={currentContentType} />

      <header className="border-b border-slate-800/50 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-[1600px] mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight">GuardianAI</h1>
                <p className="text-xs text-slate-400">Multi-Agent Moderation Control Center</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/30">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-green-400">System Online</span>
              </div>
              <Button variant="outline" size="sm" onClick={resetSystem} className="text-xs border-slate-700 text-slate-300 hover:bg-slate-800">
                <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                Reset Demo
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto p-4 space-y-4">
        <OrchestrationView
          isAnalyzing={isProcessing}
          negativityScore={negativityScore}
          currentAgent={currentAgent}
          moderators={moderators}
          activeStream={activeStream}
          streamSeverity={streamSeverity}
          processingStage={processingStage}
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <ContentInput onSubmit={processContent} isProcessing={isProcessing} />
          <ActivityLog activities={activities} />
          <AnalyticsPanel analytics={analyticsData} moderators={moderators} />
          <ReportsPanel analytics={analyticsData} moderators={moderators} retrainingLogs={retrainingLogs} />
        </div>
      </main>
    </div>
  );
}
