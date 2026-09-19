import axios from 'axios';

// API client pointing to Vite proxy or backend directly
const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to inject optional user-configured Gemini API Key and active Language
api.interceptors.request.use((config) => {
  const customKey = localStorage.getItem('vittara_gemini_key');
  const language = localStorage.getItem('vittara_language') || 'English';

  if (customKey && customKey.trim()) {
    config.headers['x-gemini-key'] = customKey.trim();
  }
  if (language) {
    config.headers['x-language'] = language;
  }
  return config;
});

export const apiService = {
  // Health & DB Config
  getHealth: () => api.get('/health'),
  updateDatabaseConfig: (mongodbUri) => api.post('/config/db', { mongodbUri }),
  reseedDatabase: () => api.post('/seed'),

  // AI Chat
  sendChat: ({ message, sessionId, language, contextData }) =>
    api.post('/chat', { message, sessionId, language, contextData }),
  clearChat: (sessionId) => api.post('/chat/clear', { sessionId }),
  getChatHistory: (sessionId) => api.get(`/chat/history/${sessionId}`),
  getAllSessions: () => api.get('/chat/sessions'),

  // Loan Assistant & EMI Calculator
  calculateLoan: (data) => api.post('/loan/calculate', data),
  getLoans: (params) => api.get('/loans', { params }),
  getLoanById: (id) => api.get(`/loans/${id}`),

  // Loan Comparison
  compareLoans: ({ loanIds, amount, tenure }) =>
    api.post('/compare', { loanIds, amount, tenure }),

  // Insurance Assistant
  getInsurance: (params) => api.get('/insurance', { params }),
  getInsuranceById: (id) => api.get(`/insurance/${id}`),

  // Financial Term Explainer
  getTerms: () => api.get('/terms'),
  getTermExplanation: (term, lang) =>
    api.get(`/terms/${encodeURIComponent(term)}`, { params: { lang } }),

  // Document Analyzer
  analyzeDocument: (formData) =>
    api.post('/document/analyze', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

export default api;
