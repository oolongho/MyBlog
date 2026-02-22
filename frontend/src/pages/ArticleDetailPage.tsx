import type { FC } from 'react';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import MarkdownRenderer from '../components/MarkdownRenderer';

const ArticleDetailPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([
    { id: 1, author: '访客小明', content: '写得很好，学到了很多！', time: '2024-01-16 10:30' },
    { id: 2, author: '技术爱好者', content: '感谢分享，期待更多文章！', time: '2024-01-16 14:22' },
  ]);

  const article = {
    id: id,
    title: 'React 18 新特性解析',
    category: '技术',
    date: '2024-01-15',
    views: 256,
    tags: ['React', '前端'],
    content: `
## 前言

React 18 是 React 团队两年工作的成果，带来了许多令人兴奋的新特性。本文将深入探讨这些新特性，帮助你更好地理解和使用 React 18。

## 并发特性

并发是 React 18 最核心的新特性。它允许 React 准备多个版本的 UI 同时存在，并根据用户的交互优先级来决定显示哪个版本。

### Automatic Batching

在 React 18 之前，我们只能在 React 事件处理程序中自动批处理更新。现在，自动批处理适用于所有更新：

\`\`\`javascript
// React 18 之前：这些更新不会被批处理
setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React 会渲染两次，每次更新一个状态
}, 1000);

// React 18：这些更新会被自动批处理
setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React 只会渲染一次
}, 1000);
\`\`\`

### Transitions

Transitions 是 React 18 中引入的一个新概念，用于区分紧急更新和非紧急更新：

\`\`\`javascript
import { startTransition } from 'react';

// 紧急更新：显示用户输入
setInputValue(input);

// 非紧急更新：搜索结果列表
startTransition(() => {
  setSearchQuery(input);
});
\`\`\`

## Suspense 改进

React 18 对 Suspense 进行了重大改进，现在可以更好地处理异步数据获取：

\`\`\`javascript
<Suspense fallback={<Loading />}>
  <DataComponent />
</Suspense>
\`\`\`

## 总结

React 18 带来的新特性让我们的应用更加流畅，用户体验更好。建议所有 React 开发者都升级到 React 18，体验这些新特性带来的便利。
    `,
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      setComments([
        ...comments,
        {
          id: Date.now(),
          author: '访客',
          content: comment,
          time: new Date().toLocaleString('zh-CN'),
        },
      ]);
      setComment('');
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-6 max-w-4xl">
        <Link
          to="/articles"
          className="inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-primary transition-colors mb-6"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          返回文章列表
        </Link>

        <article className="card p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
              {article.category}
            </span>
            <span className="text-sm text-[var(--text-secondary)]">{article.date}</span>
            <span className="text-sm text-[var(--text-secondary)]">·</span>
            <span className="text-sm text-[var(--text-secondary)]">{article.views} 阅读</span>
          </div>

          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-6">
            {article.title}
          </h1>

          <div className="flex gap-2 mb-8">
            {article.tags.map((tag) => (
              <span key={tag} className="px-3 py-1 bg-[var(--border-color)] rounded-full text-sm text-[var(--text-secondary)]">
                #{tag}
              </span>
            ))}
          </div>

          <div className="prose prose-lg max-w-none text-[var(--text-primary)]">
            <MarkdownRenderer content={article.content} />
          </div>
        </article>

        <section className="card p-8">
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L5 20l1.395-3.72C5.512 15.042 5 13.574 5 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            评论 ({comments.length})
          </h2>

          <form onSubmit={handleSubmitComment} className="mb-8">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="写下你的评论..."
              className="input-field min-h-[100px] resize-none mb-4"
            />
            <button type="submit" className="btn-primary">
              发表评论
            </button>
          </form>

          <div className="space-y-4">
            {comments.map((c) => (
              <div key={c.id} className="p-4 bg-[var(--border-color)]/30 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-[var(--text-primary)]">{c.author}</span>
                  <span className="text-xs text-[var(--text-secondary)]">{c.time}</span>
                </div>
                <p className="text-[var(--text-secondary)]">{c.content}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ArticleDetailPage;
