// Central API URL builder using Vite env
// const base = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
// if (!path.startsWith('/')) return `${base}/${path}`;
// return `${base}${path}`;

export const apiUrl = () => {
  return "http://localhost:2000"
};

