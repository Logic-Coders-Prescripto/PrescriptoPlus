// Centralized backend API base URL.
//
// - LOCAL DEV: leave VITE_API_BASE_URL unset. Vite's dev server proxy
//   (see vite.config.js) will forward /api requests to localhost:5001.
// - PRODUCTION (Cloudflare Pages, Netlify, Vercel, etc.): Cloudflare Pages
//   only serves the static frontend, it cannot run this Express backend.
//   Deploy server/server.js separately (e.g. on Render.com, Railway, Fly.io)
//   and set VITE_API_BASE_URL to that backend's full URL, e.g.
//   https://prescripto-backend.onrender.com
//
// This value must be set at BUILD TIME (Cloudflare Pages -> Settings ->
// Environment variables -> VITE_API_BASE_URL) since Vite bakes it into
// the build.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export function apiUrl(path) {
  return `${API_BASE_URL}${path}`;
}
