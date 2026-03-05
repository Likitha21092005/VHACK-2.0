
let mockData = {
  Moderator: [
    { id: '1', name: 'Moderator A', status: 'active', current_score: 0, task_count: 0, break_count: 0, specialization: 'general' },
    { id: '2', name: 'Moderator B', status: 'active', current_score: 0, task_count: 0, break_count: 0, specialization: 'general' },
    { id: '3', name: 'Moderator C', status: 'active', current_score: 0, task_count: 0, break_count: 0, specialization: 'general' },
  ],
  ContentSubmission: [],
  AnalyticsSnapshot: [
    {
      id: 'analytics1', date: new Date().toISOString().split('T')[0],
      total_inputs: 0, auto_removed_count: 0, moderation_count: 0,
      category_safe: 0, category_complaint: 0, category_harassment: 0,
      category_abuse: 0, category_threat: 0, total_break_events: 0, avg_processing_time_ms: 0,
    }
  ],
  RetrainingLog: [],
};

function createEntity(entityName) {
  return {
    list: async (sort, limit) => [...(mockData[entityName] || [])],
    filter: async (query) => (mockData[entityName] || []).filter(item =>
      Object.entries(query).every(([k, v]) => item[k] === v)
    ),
    create: async (data) => {
      const item = { id: Date.now().toString(), ...data };
      mockData[entityName] = [...(mockData[entityName] || []), item];
      return item;
    },
    bulkCreate: async (items) => {
      const created = items.map(d => ({ id: Date.now().toString() + Math.random(), ...d }));
      mockData[entityName] = [...(mockData[entityName] || []), ...created];
      return created;
    },
    update: async (id, data) => {
      mockData[entityName] = (mockData[entityName] || []).map(item =>
        item.id === id ? { ...item, ...data } : item
      );
      return mockData[entityName].find(i => i.id === id);
    },
    delete: async (id) => {
      mockData[entityName] = (mockData[entityName] || []).filter(i => i.id !== id);
    },
    subscribe: (callback) => () => {},
  };
}

export const base44 = {
  entities: new Proxy({}, {
    get: (_, entityName) => createEntity(entityName),
  }),
  integrations: {
    Core: {
      InvokeLLM: async ({ prompt, response_json_schema }) => {
        // Mock LLM response
        return {
          label: 'neutral',
          confidence: 0.85,
          category: 'complaint',
          negativity_score: Math.floor(Math.random() * 80),
        };
      },
    },
  },
  auth: {
    me: async () => ({ id: '1', email: 'demo@example.com', full_name: 'Demo User', role: 'admin' }),
    isAuthenticated: async () => true,
  },
};
