const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const API = {
  BASE_URL: API_BASE_URL,
  
  auth: {
    login: `${API_BASE_URL}/api/auth/login`,
    logout: `${API_BASE_URL}/api/auth/logout`,
    profile: `${API_BASE_URL}/api/auth/profile`,
    init: `${API_BASE_URL}/api/auth/init`,
  },
  
  visitor: {
    register: `${API_BASE_URL}/api/visitor/register`,
    login: `${API_BASE_URL}/api/visitor/login`,
    profile: `${API_BASE_URL}/api/visitor/profile`,
  },
  
  articles: {
    list: (params?: { page?: number; pageSize?: number; category?: string; keyword?: string }) => {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.set('page', String(params.page));
      if (params?.pageSize) searchParams.set('pageSize', String(params.pageSize));
      if (params?.category) searchParams.set('category', params.category);
      if (params?.keyword) searchParams.set('keyword', params.keyword);
      const query = searchParams.toString();
      return `${API_BASE_URL}/api/articles${query ? `?${query}` : ''}`;
    },
    detail: (id: number) => `${API_BASE_URL}/api/articles/${id}`,
    view: (id: number) => `${API_BASE_URL}/api/articles/${id}/view`,
    create: `${API_BASE_URL}/api/articles`,
    update: (id: number) => `${API_BASE_URL}/api/articles/${id}`,
    delete: (id: number) => `${API_BASE_URL}/api/articles/${id}`,
  },
  
  moments: {
    list: (params?: { page?: number; pageSize?: number }) => {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.set('page', String(params.page));
      if (params?.pageSize) searchParams.set('pageSize', String(params.pageSize));
      const query = searchParams.toString();
      return `${API_BASE_URL}/api/moments${query ? `?${query}` : ''}`;
    },
    detail: (id: number) => `${API_BASE_URL}/api/moments/${id}`,
    create: `${API_BASE_URL}/api/moments`,
    update: (id: number) => `${API_BASE_URL}/api/moments/${id}`,
    delete: (id: number) => `${API_BASE_URL}/api/moments/${id}`,
    like: (id: number) => `${API_BASE_URL}/api/moments/${id}/like`,
    liked: `${API_BASE_URL}/api/moments/liked`,
  },
  
  gallery: {
    list: (params?: { page?: number; pageSize?: number; category?: string }) => {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.set('page', String(params.page));
      if (params?.pageSize) searchParams.set('pageSize', String(params.pageSize));
      if (params?.category) searchParams.set('category', params.category);
      const query = searchParams.toString();
      return `${API_BASE_URL}/api/gallery${query ? `?${query}` : ''}`;
    },
    create: `${API_BASE_URL}/api/gallery`,
    update: (id: number) => `${API_BASE_URL}/api/gallery/${id}`,
    delete: (id: number) => `${API_BASE_URL}/api/gallery/${id}`,
  },
  
  friends: {
    list: `${API_BASE_URL}/api/friends`,
    all: `${API_BASE_URL}/api/friends/all`,
    apply: `${API_BASE_URL}/api/friends/apply`,
    status: (id: number) => `${API_BASE_URL}/api/friends/${id}/status`,
    update: (id: number) => `${API_BASE_URL}/api/friends/${id}`,
    delete: (id: number) => `${API_BASE_URL}/api/friends/${id}`,
  },
  
  comments: {
    list: (params?: { page?: number; pageSize?: number; articleId?: number; momentId?: number }) => {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.set('page', String(params.page));
      if (params?.pageSize) searchParams.set('pageSize', String(params.pageSize));
      if (params?.articleId) searchParams.set('articleId', String(params.articleId));
      if (params?.momentId) searchParams.set('momentId', String(params.momentId));
      const query = searchParams.toString();
      return `${API_BASE_URL}/api/comments${query ? `?${query}` : ''}`;
    },
    all: `${API_BASE_URL}/api/comments/all`,
    create: `${API_BASE_URL}/api/comments`,
    delete: (id: number) => `${API_BASE_URL}/api/comments/${id}`,
  },
  
  stats: `${API_BASE_URL}/api/stats`,
  
  settings: {
    public: `${API_BASE_URL}/api/settings/public`,
    all: `${API_BASE_URL}/api/settings`,
    update: `${API_BASE_URL}/api/settings`,
    updateKey: (key: string) => `${API_BASE_URL}/api/settings/${key}`,
  },
  
  health: `${API_BASE_URL}/api/health`,
} as const;

export async function fetchApi<T>(url: string, options?: RequestInit): Promise<T> {
  const hasBody = options?.body !== undefined;
  const headers: HeadersInit = {};
  
  if (options?.headers) {
    Object.assign(headers, options.headers);
  }
  
  if (hasBody) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: '请求失败' }));
    throw new Error(error.error || '请求失败');
  }

  return response.json();
}

export async function fetchWithAuth<T>(url: string, token: string, options?: RequestInit): Promise<T> {
  return fetchApi<T>(url, {
    ...options,
    headers: {
      ...options?.headers,
      Authorization: `Bearer ${token}`,
    },
  });
}
