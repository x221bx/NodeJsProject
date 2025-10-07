// Central API URL builder using Vite env
const base = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

export const apiUrl = (path) => {
  if (!path.startsWith('/')) return `${base}/${path}`;
  return `${base}${path}`;
};

