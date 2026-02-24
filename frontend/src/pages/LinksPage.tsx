import type { FC } from 'react';
import { useState, useEffect, useCallback } from 'react';
import type { FriendLink } from '../types';
import { API, fetchApi } from '../config/api';

const LinksPage: FC = () => {
  const [friends, setFriends] = useState<FriendLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    description: '',
    email: '',
  });

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const data = await fetchApi<FriendLink[]>(API.friends.list);
        setFriends(data || []);
      } catch (error) {
        console.error('Failed to fetch friends:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFriends();
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchApi(API.friends.apply, {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      alert('申请已提交，我会尽快处理！');
      setShowApplyForm(false);
      setFormData({ name: '', url: '', description: '', email: '' });
    } catch (error) {
      alert('提交失败，请稍后重试');
    }
  }, [formData]);

  const handleToggleForm = useCallback(() => {
    setShowApplyForm(prev => !prev);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center py-12">
            <p className="text-[var(--text-secondary)]">加载中...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">友情链接</h1>
          <p className="text-[var(--text-secondary)]">与志同道合的朋友们互相链接</p>
        </div>

        <section aria-labelledby="friends-heading">
          <h2 id="friends-heading" className="sr-only">友链列表</h2>
          {friends.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8" role="list" aria-label="友情链接列表">
              {friends.map((friend) => (
                <a
                  key={friend.id}
                  href={friend.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card p-5 flex items-start gap-4 hover:shadow-lg transition-all duration-300 group"
                  aria-label={`访问 ${friend.name} 的博客：${friend.description}`}
                  role="listitem"
                >
                  <div className="w-14 h-14 bg-[var(--border-color)] rounded-xl flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform" aria-hidden="true">
                    {friend.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[var(--text-primary)] mb-1 group-hover:text-primary transition-colors">
                      {friend.name}
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)] line-clamp-2">
                      {friend.description}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="card p-12 text-center mb-8">
              <svg className="w-16 h-16 text-[var(--text-secondary)] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <p className="text-[var(--text-secondary)]">暂无友链</p>
            </div>
          )}
        </section>

        <section className="card p-8" aria-labelledby="apply-heading">
          <div className="flex items-center justify-between mb-6">
            <h2 id="apply-heading" className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              申请友链
            </h2>
            <button
              type="button"
              onClick={handleToggleForm}
              className="btn-primary text-sm"
              aria-expanded={showApplyForm}
              aria-controls="apply-form"
            >
              {showApplyForm ? '取消' : '申请友链'}
            </button>
          </div>

          {showApplyForm && (
            <form id="apply-form" onSubmit={handleSubmit} className="space-y-4" aria-label="友链申请表单">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="site-name" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                    网站名称 *
                  </label>
                  <input
                    id="site-name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-field"
                    placeholder="你的网站名称"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="site-url" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                    网站地址 *
                  </label>
                  <input
                    id="site-url"
                    type="url"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    className="input-field"
                    placeholder="https://example.com"
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="contact-email" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  联系邮箱
                </label>
                <input
                  id="contact-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-field"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label htmlFor="site-description" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  网站简介 *
                </label>
                <textarea
                  id="site-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-field min-h-[100px] resize-none"
                  placeholder="简单介绍一下你的网站..."
                  required
                />
              </div>
              <div className="flex gap-4">
                <button type="submit" className="btn-primary">
                  提交申请
                </button>
                <button
                  type="button"
                  onClick={handleToggleForm}
                  className="btn-secondary"
                >
                  取消
                </button>
              </div>
            </form>
          )}

          {!showApplyForm && (
            <div className="bg-primary/5 rounded-xl p-6">
              <h3 className="font-medium text-[var(--text-primary)] mb-3">友链要求：</h3>
              <ul className="text-sm text-[var(--text-secondary)] space-y-2" role="list">
                <li className="flex items-start gap-2">
                  <span className="text-primary" aria-hidden="true">•</span>
                  网站内容积极向上，无违法违规内容
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary" aria-hidden="true">•</span>
                  网站能够正常访问，且有一定的原创内容
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary" aria-hidden="true">•</span>
                  优先考虑技术类、设计类博客
                </li>
              </ul>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default LinksPage;
