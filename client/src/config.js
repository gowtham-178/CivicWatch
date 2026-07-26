const getBaseUrl = () => {
  if (process.env.REACT_APP_API_BASE_URL) return process.env.REACT_APP_API_BASE_URL;
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return `${window.location.origin}/api`;
  }
  return 'http://localhost:5000/api';
};

const getServerUrl = () => {
  if (process.env.REACT_APP_API_SERVER_URL) return process.env.REACT_APP_API_SERVER_URL;
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return window.location.origin;
  }
  return 'http://localhost:5000';
};

export const API_BASE_URL = getBaseUrl();
export const API_SERVER_URL = getServerUrl();
