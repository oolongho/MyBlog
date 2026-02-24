import type { FC } from 'react';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import type { Article } from '../types';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { API, fetchApi } from '../config/api';
import { formatRelativeTime } from '../utils/date';

const ArticlesPage: FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [debouncedSearch] = useDebouncedValue(searchQuery, 300);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data = await fetchApi<{ data: Article[]; total: number }>(
          API.articles.list({ pageSize: 100 })
        );
        setArticles(data.data || []);
      } catch (error) {
        console.error('Failed to fetch articles:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(articles.map(a => a.category));
    return ['全部', ...Array.from(cats)];
  }, [articles]);

  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      const matchesCategory = selectedCategory === '全部' || article.category === selectedCategory;
      const matchesSearch = article.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                           article.excerpt.toLowerCase().includes(debouncedSearch.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [articles, selectedCategory, debouncedSearch]);

  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center py-12">
            <p className="text-[var(--text-secondary)]">加载中...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex flex-col md:flex-row gap-8">
          <aside className="md:w-56 flex-shrink-0">
            <div className="card p-4 sticky top-24">
              <h3 className="font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                文章分类
              </h3>
              <ul className="space-y-1" role="listbox" aria-label="文章分类">
                {categories.map((category) => (
                  <li key={category}>
                    <button
                      type="button"
                      onClick={() => handleCategoryChange(category)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-300 ${
                        selectedCategory === category
                          ? 'bg-primary text-gray-900 font-medium'
                          : 'text-[var(--text-secondary)] hover:bg-primary/10 hover:text-primary'
                      }`}
                      role="option"
                      aria-selected={selectedCategory === category}
                    >
                      {category}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <main className="flex-1">
            <div className="mb-6">
              <div className="relative">
                <input
                  type="search"
                  placeholder="搜索文章..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="搜索文章"
                  className="w-full border-2 border-[var(--border-color)] rounded-lg py-3 pl-10 pr-4 bg-[var(--card-bg)] text-[var(--text-primary)] outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                />
                <svg className="w-5 h-5 text-[var(--text-secondary)] absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">
                {selectedCategory === '全部' ? '全部文章' : selectedCategory}
                <span className="text-sm font-normal text-[var(--text-secondary)] ml-2">
                  ({filteredArticles.length} 篇)
                </span>
              </h1>
            </div>

            <div className="space-y-4">
              {filteredArticles.length > 0 ? (
                filteredArticles.map((article) => (
                  <Link
                    key={article.id}
                    to={`/articles/${article.id}`}
                    className="card p-6 block hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs font-medium">
                        {article.category}
                      </span>
                      <span className="text-xs text-[var(--text-secondary)]">{formatRelativeTime(article.createdAt)}</span>
                    </div>
                    <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2 hover:text-primary transition-colors">
                      {article.title}
                    </h2>
                    <p className="text-[var(--text-secondary)] mb-4 line-clamp-2">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        {article.tags?.map((tag) => (
                          <span key={tag} className="px-2 py-1 bg-[var(--border-color)] rounded text-xs text-[var(--text-secondary)]">
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center text-xs text-[var(--text-secondary)]">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        {article.views} 阅读
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="card p-12 text-center">
                  <svg className="w-16 h-16 text-[var(--text-secondary)] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-[var(--text-secondary)]">没有找到相关文章</p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ArticlesPage;
