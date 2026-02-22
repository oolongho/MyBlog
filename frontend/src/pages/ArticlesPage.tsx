import type { FC } from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const ArticlesPage: FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('全部');

  const categories = ['全部', '技术', '生活', '随笔', '教程'];

  const articles = [
    { id: 1, title: 'React 18 新特性解析', excerpt: '深入了解 React 18 带来的并发特性、Suspense 改进以及自动批处理等新功能...', date: '2024-01-15', category: '技术', views: 256, tags: ['React', '前端'] },
    { id: 2, title: 'TypeScript 高级类型技巧', excerpt: '掌握 TypeScript 的高级类型系统，包括条件类型、映射类型和模板字面量类型...', date: '2024-01-10', category: '技术', views: 189, tags: ['TypeScript', '前端'] },
    { id: 3, title: '我的 2024 年计划', excerpt: '新的一年，新的开始。分享一下我今年的学习和生活计划...', date: '2024-01-01', category: '生活', views: 342, tags: ['生活', '计划'] },
    { id: 4, title: 'Vite 构建工具入门指南', excerpt: '从零开始学习 Vite，了解它为什么比 Webpack 更快，以及如何在项目中使用...', date: '2023-12-20', category: '教程', views: 421, tags: ['Vite', '构建工具'] },
    { id: 5, title: 'Tailwind CSS 实战经验分享', excerpt: '分享使用 Tailwind CSS 开发项目的经验，包括最佳实践和常见问题解决方案...', date: '2023-12-15', category: '技术', views: 178, tags: ['CSS', 'Tailwind'] },
    { id: 6, title: '周末爬山记', excerpt: '周末和朋友一起去爬山，风景很美，心情舒畅，记录一下这次愉快的经历...', date: '2023-12-10', category: '随笔', views: 89, tags: ['生活', '户外'] },
  ];

  const filteredArticles = articles.filter(article => {
    const matchesCategory = selectedCategory === '全部' || article.category === selectedCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
              <ul className="space-y-1">
                {categories.map((category) => (
                  <li key={category}>
                    <button
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-300 ${
                        selectedCategory === category
                          ? 'bg-primary text-gray-900 font-medium'
                          : 'text-[var(--text-secondary)] hover:bg-primary/10 hover:text-primary'
                      }`}
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
                  type="text"
                  placeholder="搜索文章..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full border-2 border-[var(--border-color)] rounded-lg py-3 pl-10 pr-4 bg-[var(--card-bg)] text-[var(--text-primary)] outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                />
                <svg className="w-5 h-5 text-[var(--text-secondary)] absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                      <span className="text-xs text-[var(--text-secondary)]">{article.date}</span>
                    </div>
                    <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2 hover:text-primary transition-colors">
                      {article.title}
                    </h2>
                    <p className="text-[var(--text-secondary)] mb-4 line-clamp-2">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        {article.tags.map((tag) => (
                          <span key={tag} className="px-2 py-1 bg-[var(--border-color)] rounded text-xs text-[var(--text-secondary)]">
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center text-xs text-[var(--text-secondary)]">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  <svg className="w-16 h-16 text-[var(--text-secondary)] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
