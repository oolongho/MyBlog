import type { FC } from 'react';
import { useState } from 'react';

interface FriendLink {
  id: number;
  name: string;
  avatar: string;
  url: string;
  description: string;
}

const LinksPage: FC = () => {
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    description: '',
    email: '',
  });

  const friendLinks: FriendLink[] = [
    { id: 1, name: '小明', avatar: '👨‍💻', url: 'https://example.com/xiaoming', description: '前端开发工程师，专注于 React 和 Vue 技术栈' },
    { id: 2, name: '小红', avatar: '👩‍🎨', url: 'https://example.com/xiaohong', description: 'UI/UX 设计师，热爱设计和用户体验' },
    { id: 3, name: '小刚', avatar: '👨‍🔬', url: 'https://example.com/xiaogang', description: '后端开发工程师，Java 和 Go 技术栈' },
    { id: 4, name: '小李', avatar: '👩‍💻', url: 'https://example.com/xiaoli', description: '全栈开发者，热爱开源和技术分享' },
    { id: 5, name: '小王', avatar: '👨‍🚀', url: 'https://example.com/xiaowang', description: '算法工程师，专注于机器学习和深度学习' },
    { id: 6, name: '小张', avatar: '👩‍🔬', url: 'https://example.com/xiaozhang', description: '数据分析师，热爱数据可视化' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('申请友链:', formData);
    alert('申请已提交，我会尽快处理！');
    setShowApplyForm(false);
    setFormData({ name: '', url: '', description: '', email: '' });
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">友情链接</h1>
          <p className="text-[var(--text-secondary)]">与志同道合的朋友们互相链接</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {friendLinks.map((friend) => (
            <a
              key={friend.id}
              href={friend.url}
              target="_blank"
              rel="noopener noreferrer"
              className="card p-5 flex items-start gap-4 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="w-14 h-14 bg-[var(--border-color)] rounded-xl flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform">
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

        <div className="card p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              申请友链
            </h2>
            <button
              onClick={() => setShowApplyForm(!showApplyForm)}
              className="btn-primary text-sm"
            >
              {showApplyForm ? '取消' : '申请友链'}
            </button>
          </div>

          {showApplyForm && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                    网站名称 *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-field"
                    placeholder="你的网站名称"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                    网站地址 *
                  </label>
                  <input
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
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  联系邮箱
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-field"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  网站简介 *
                </label>
                <textarea
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
                  onClick={() => setShowApplyForm(false)}
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
              <ul className="text-sm text-[var(--text-secondary)] space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  网站内容积极向上，无违法违规内容
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  网站能够正常访问，且有一定的原创内容
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  优先考虑技术类、设计类博客
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LinksPage;
