import data from '../data.json';

export type PortfolioData = typeof data;

export const REPO_OWNER = (import.meta.env.VITE_GH_OWNER as string) || 'arguto1993';
export const REPO_NAME = (import.meta.env.VITE_GH_REPO as string) || 'arguto1993.github.io';
export const DATA_PATH = 'src/data.json';
export const OAUTH_CLIENT_ID = (import.meta.env.VITE_GH_CLIENT_ID as string) || '';
export const OAUTH_WORKER_URL = (import.meta.env.VITE_OAUTH_WORKER_URL as string) || '';

export const ADMIN_HASH = '#/admin';
export const SESSION_TOKEN_KEY = 'arguto_admin_token';
export const SESSION_STATE_KEY = 'arguto_admin_oauth_state';
