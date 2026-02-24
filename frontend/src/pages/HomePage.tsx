import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Article, Moment, FriendLink } from '../types';
import { API, fetchApi } from '../config/api';

const HomePage: FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [moments, setMoments] = useState<Moment[]>([]);
  const [friends, setFriends] = useState<FriendLink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [articlesRes, momentsRes, friendsRes] = await Promise.all([
          fetchApi<{ data: Article[] }>(API.articles.list({ pageSize: 3 })),
          fetchApi<Moment[]>(API.moments.list({ pageSize: 3 })),
          fetchApi<FriendLink[]>(API.friends.list),
        ]);
        
        setArticles(articlesRes.data || []);
        setMoments(momentsRes || []);
        setFriends(friendsRes || []);
      } catch (error) {
        console.error('Failed to fetch homepage data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
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
        <section className="mb-12" aria-labelledby="profile-heading">
          <div className="card p-8 flex flex-col md:flex-row items-center gap-6">
            <img src="/logo.png" alt="oolongho 的头像" className="w-24 h-24 object-contain" loading="lazy" />
            <div className="text-center md:text-left">
              <h1 id="profile-heading" className="text-2xl font-bold text-[var(--text-primary)] mb-2">Hello, I'm oolongho</h1>
              <p className="text-[var(--text-secondary)] mb-4">一个热爱技术、热爱生活的开发者</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-2" role="list" aria-label="技能标签">
                <span role="listitem" className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">前端开发</span>
                <span role="listitem" className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">React</span>
                <span role="listitem" className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">TypeScript</span>
              </div>
            </div>
          </div>
        </section>

        <div className="grid md:grid-cols-3 gap-8">
          <section className="md:col-span-2" aria-labelledby="articles-heading">
            <div className="flex items-center justify-between mb-6">
              <h2 id="articles-heading" className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                最新文章
              </h2>
              <Link to="/articles" className="text-primary hover:text-primary-dark text-sm font-medium transition-colors">
                查看全部 →
              </Link>
            </div>
            
            {articles.length > 0 ? (
              <div className="space-y-4" role="list" aria-label="最新文章列表">
                {articles.map((article) => (
                  <Link 
                    key={article.id}
                    to={`/articles/${article.id}`}
                    className="card p-5 block hover:shadow-lg transition-all duration-300"
                    role="listitem"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs font-medium">
                        {article.category}
                      </span>
                      <time className="text-xs text-[var(--text-secondary)]" dateTime={article.date || article.createdAt}>{article.date || article.createdAt}</time>
                    </div>
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2 hover:text-primary transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-3">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center text-xs text-[var(--text-secondary)]">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm0 0a3 3 0 11-6 0 3 3 0 016 0zm-9 9a3 3 0 011-6 0 3 3 0 016 0zm0 0a3 3 0 011-6 0 3 3 0 016 0z" />
                      </svg>
                      {article.views} 阅读
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="card p-8 text-center">
                <svg className="w-12 h-12 text-[var(--text-secondary)] mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-[var(--text-secondary)]">暂无文章</p>
              </div>
            )}
          </section>

          <section aria-labelledby="moments-heading">
            <div className="flex items-center justify-between mb-6">
              <h2 id="moments-heading" className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L5 20l1.395-3.72C5.512 15.042 5 13.574 5 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                最新说说
              </h2>
              <Link to="/moments" className="text-primary hover:text-primary-dark text-sm font-medium transition-colors">
                查看全部 →
              </Link>
            </div>
            
            {moments.length > 0 ? (
              <div className="space-y-3 mb-8" role="list" aria-label="最新说说列表">
                {moments.map((moment) => (
                  <article key={moment.id} className="card p-4" role="listitem">
                    <p className="text-[var(--text-primary)] text-sm mb-2">{moment.content}</p>
                    <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
                      <time>{moment.time || moment.createdAt}</time>
                      <div className="flex items-center gap-1" aria-label={`${moment.likes} 个赞`}>
                        <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                        <span>{moment.likes}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="card p-6 text-center mb-8">
                <p className="text-sm text-[var(--text-secondary)]">暂无说说</p>
              </div>
            )}

            <div className="flex items-center justify-between mb-6">
              <h2 id="friends-heading" className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                友情链接
              </h2>
              <Link to="/links" className="text-primary hover:text-primary-dark text-sm font-medium transition-colors">
                查看全部 →
              </Link>
            </div>
            
            {friends.length > 0 ? (
              <div className="grid grid-cols-1 gap-3" role="list" aria-label="友情链接列表">
                {friends.map((friend) => (
                  <a
                    key={friend.id}
                    href={friend.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card p-4 flex items-center gap-3 hover:shadow-lg transition-all duration-300"
                    aria-label={`访问 ${friend.name} 的博客：${friend.description}`}
                  >
                    <span className="text-2xl" aria-hidden="true">{friend.avatar}</span>
                    <div>
                      <h4 className="font-medium text-[var(--text-primary)]">{friend.name}</h4>
                      <p className="text-xs text-[var(--text-secondary)]">{friend.description}</p>
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <div className="card p-6 text-center">
                <p className="text-sm text-[var(--text-secondary)]">暂无友链</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
