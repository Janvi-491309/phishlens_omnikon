import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const checkHealth = async () => {
  try {
    const response = await api.get('/api/health');
    return response.status === 200;
  } catch (error) {
    console.error('Health check failed:', error);
    return false;
  }
};

export const analyzeMessage = async (text, language = 'en') => {
  const validLanguages = ['en', 'hi', 'te'];
  const selectedLanguage = validLanguages.includes(language)
    ? language
    : 'en';

  const response = await api.post('/api/analyze/message', {
    text,
    language: selectedLanguage,
  });

  return response.data;
};

export const analyzeURL = async (url) => {
  const response = await api.post('/api/analyze/url', {
    url,
  });

  return response.data;
};