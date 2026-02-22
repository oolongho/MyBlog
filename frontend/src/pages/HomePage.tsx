import type { FC } from 'react';
import { Link } from 'react-router-dom';

const HomePage: FC = () => {
  const featuredArticles = [
    { id: 1, title: 'React 18 新特性解析', excerpt: '深入了解 React 18 带来的并发特性、Suspense 改进以及自动批处理等新功能...', date: '2024-01-15', category: '技术', views: 256 },
    { id: 2, title: 'TypeScript 高级类型技巧', excerpt: '掌握 TypeScript 的高级类型系统，包括条件类型、映射类型和模板字面量类型...', date: '2024-01-10', category: '技术', views: 189 },
    { id: 3, title: '我的 2024 年计划', excerpt: '新的一年，新的开始。分享一下我今年的学习和生活计划...', date: '2024-01-01', category: '生活', views: 342 },
  ];

  const recentMoments = [
    { id: 1, content: '今天天气真好，出去散步了一下，心情舒畅~', time: '2小时前', likes: 12 },
    { id: 2, content: '终于把博客搭建完成了，开心！', time: '昨天', likes: 28 },
    { id: 3, content: '推荐一本好书《深入理解计算机系统》，非常值得反复阅读。', time: '3天前', likes: 45 },
  ];

  const friends = [
    { name: '小明', avatar: '👨‍💻', url: 'https://example.com', description: '前端开发工程师' },
    { name: '小红', avatar: '👩‍🎨', url: 'https://example.com', description: 'UI/UX 设计师' },
    { name: '小刚', avatar: '👨‍🔬', url: 'https://example.com', description: '后端开发工程师' },
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-6 max-w-6xl">
        <section className="mb-12">
          <div className="card p-8 flex flex-col md:flex-row items-center gap-6">
            <img src="/logo.png" alt="avatar" className="w-24 h-24 object-contain" />
            <div className="text-center md:text-left">
              <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Hello, I'm oolongho</h1>
              <p className="text-[var(--text-secondary)] mb-4">一个热爱技术、热爱生活的开发者</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">前端开发</span>
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">React</span>
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">TypeScript</span>
              </div>
            </div>
          </div>
        </section>

        <div className="grid md:grid-cols-3 gap-8">
          <section className="md:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                最新文章
              </h2>
              <Link to="/articles" className="text-primary hover:text-primary-dark text-sm font-medium transition-colors">
                查看全部 →
              </Link>
            </div>
            
            <div className="space-y-4">
              {featuredArticles.map((article) => (
                <Link 
                  key={article.id}
                  to={`/articles/${article.id}`}
                  className="card p-5 block hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs font-medium">
                      {article.category}
                    </span>
                    <span className="text-xs text-[var(--text-secondary)]">{article.date}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2 hover:text-primary transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-3">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center text-xs text-[var(--text-secondary)]">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm0 0a3 3 0 11-6 0 3 3 0 016 0zm-9 9a3 3 0 011-6 0 3 3 0 016 0zm0 0a3 3 0 011-6 0 3 3 0 016 0z" />
                    </svg>
                    {article.views} 阅读
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L5 20l1.395-3.72C5.512 15.042 5 13.574 5 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                最新说说
              </h2>
              <Link to="/moments" className="text-primary hover:text-primary-dark text-sm font-medium transition-colors">
                查看全部 →
              </Link>
            </div>
            
            <div className="space-y-3 mb-8">
              {recentMoments.map((moment) => (
                <div key={moment.id} className="card p-4">
                  <p className="text-[var(--text-primary)] text-sm mb-2">{moment.content}</p>
                  <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
                    <span>{moment.time}</span>
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                      {moment.likes}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                友情链接
              </h2>
              <Link to="/links" className="text-primary hover:text-primary-dark text-sm font-medium transition-colors">
                查看全部 →
              </Link>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              {friends.map((friend, index) => (
                <a
                  key={index}
                  href={friend.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card p-4 flex items-center gap-3 hover:shadow-lg transition-all duration-300"
                >
                  <span className="text-2xl">{friend.avatar}</span>
                  <div>
                    <h4 className="font-medium text-[var(--text-primary)]">{friend.name}</h4>
                    <p className="text-xs text-[var(--text-secondary)]">{friend.description}</p>
                  </div>
                </a>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
