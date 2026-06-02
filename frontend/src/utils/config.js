export const getApiUrl = (path = '') => {
  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const base = isLocal ? 'http://localhost:5000' : '/_/backend';
  return `${base}${path}`;
};
