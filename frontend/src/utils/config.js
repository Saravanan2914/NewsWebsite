export const getApiUrl = (path = '') => {
  const hostname = window.location.hostname;
  const isLocal = 
    hostname === 'localhost' || 
    hostname === '127.0.0.1' || 
    hostname === '[::1]' || 
    hostname.startsWith('192.168.') || 
    hostname.startsWith('10.') || 
    hostname.startsWith('172.') ||
    window.location.port !== '';

  const base = isLocal ? 'http://localhost:5000' : '/_/backend';
  return `${base}${path}`;
};
