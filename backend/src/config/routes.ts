export const API_PREFIX = '/api';

export const ROUTES = {
  auth: {
    login: '/api/auth/login',
    logout: '/api/auth/logout',
    profile: '/api/auth/profile',
    init: '/api/auth/init',
  },
  visitor: {
    register: '/api/visitor/register',
    login: '/api/visitor/login',
    profile: '/api/visitor/profile',
  },
  articles: {
    list: '/api/articles',
    detail: (id: number) => `/api/articles/${id}`,
    view: (id: number) => `/api/articles/${id}/view`,
    create: '/api/articles',
    update: (id: number) => `/api/articles/${id}`,
    delete: (id: number) => `/api/articles/${id}`,
  },
  moments: {
    list: '/api/moments',
    detail: (id: number) => `/api/moments/${id}`,
    create: '/api/moments',
    delete: (id: number) => `/api/moments/${id}`,
    like: (id: number) => `/api/moments/${id}/like`,
  },
  gallery: {
    list: '/api/gallery',
    create: '/api/gallery',
    delete: (id: number) => `/api/gallery/${id}`,
  },
  friends: {
    list: '/api/friends',
    all: '/api/friends/all',
    apply: '/api/friends/apply',
    status: (id: number) => `/api/friends/${id}/status`,
    delete: (id: number) => `/api/friends/${id}`,
  },
  comments: {
    list: '/api/comments',
    create: '/api/comments',
    delete: (id: number) => `/api/comments/${id}`,
  },
  health: '/api/health',
} as const;
