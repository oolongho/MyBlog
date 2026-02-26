import type { FC } from 'react';
import { useState, useEffect, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { API, fetchApi, fetchWithAuth } from '../config/api';
import { formatDate, formatRelativeTime } from '../utils/date';
import { useAuth } from '../hooks/useAuth';

interface Article {
  id: number;
  title: string;
  content: string;
  category: string;
  views: number;
  tags: string[];
  createdAt: string;
}

interface Reply {
  id: number;
  content: string;
  createdAt: string;
  visitor: {
    id: number;
    nickname: string;
    avatar?: string;
  };
}

interface Comment {
  id: number;
  content: string;
  createdAt: string;
  visitor: {
    id: number;
    nickname: string;
    avatar?: string;
  };
  replies?: Reply[];
}

const ArticleDetailPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const { isAuthenticated, token } = useAuth();

  const fetchArticle = useCallback(async () => {
    if (!id) return;
    
    try {
      const data = await fetchApi<Article>(API.articles.detail(Number(id)));
      setArticle(data);
      
      fetchApi(API.articles.view(Number(id)), { method: 'POST' }).catch(() => {});
    } catch (err) {
      setError('文章不存在');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchComments = useCallback(async () => {
    if (!id) return;
    setCommentsLoading(true);
    try {
      const data = await fetchApi<Comment[]>(API.comments.list({ articleId: Number(id), pageSize: 50 }));
      setComments(data || []);
    } catch (err) {
      console.error('Failed to fetch comments:', err);
    } finally {
      setCommentsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchArticle();
    fetchComments();
  }, [fetchArticle, fetchComments]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    
    if (!isAuthenticated || !token) {
      alert('请先登录');
      return;
    }

    try {
      const newComment = await fetchWithAuth<Comment>(API.comments.create, token!, {
        method: 'POST',
        body: JSON.stringify({
          content: comment.trim(),
          articleId: Number(id),
        }),
      });
      setComments(prev => [newComment, ...prev]);
      setComment('');
    } catch (err) {
      alert('评论失败，请稍后重试');
    }
  };

  const handleSubmitReply = async (parentId: number) => {
    if (!replyContent.trim()) return;
    
    if (!isAuthenticated || !token) {
      alert('请先登录');
      return;
    }

    try {
      const newReply = await fetchWithAuth<Reply>(API.comments.create, token!, {
        method: 'POST',
        body: JSON.stringify({
          content: replyContent.trim(),
          articleId: Number(id),
          parentId,
        }),
      });
      
      setComments(prev => prev.map(c => {
        if (c.id === parentId) {
          return { ...c, replies: [...(c.replies || []), newReply] };
        }
        return c;
      }));
      
      setReplyingTo(null);
      setReplyContent('');
    } catch (err) {
      alert('回复失败，请稍后重试');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center py-12">
            <p className="text-[var(--text-secondary)]">加载中...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="card p-12 text-center">
            <svg className="w-16 h-16 text-[var(--text-secondary)] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-[var(--text-secondary)] mb-4">{error || '文章不存在'}</p>
            <Link to="/articles" className="text-primary hover:underline">
              返回文章列表
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
            <span className="text-sm text-[var(--text-secondary)]">{formatDate(article.createdAt)}</span>
            <span className="text-sm text-[var(--text-secondary)]">·</span>
            <span className="text-sm text-[var(--text-secondary)]">{article.views} 阅读</span>
          </div>

          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-6">
            {article.title}
          </h1>

          {article.tags && article.tags.length > 0 && (
            <div className="flex gap-2 mb-8">
              {article.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 bg-[var(--border-color)] rounded-full text-sm text-[var(--text-secondary)]">
                  #{tag}
                </span>
              ))}
            </div>
          )}

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
              placeholder={isAuthenticated ? "写下你的评论..." : "请先登录后评论"}
              className="input-field min-h-[100px] resize-none mb-4"
              disabled={!isAuthenticated}
            />
            <button 
              type="submit" 
              className={`btn-primary ${!isAuthenticated ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={!isAuthenticated}
            >
              发表评论
            </button>
          </form>

          {commentsLoading ? (
            <p className="text-center text-[var(--text-secondary)] py-8">加载评论中...</p>
          ) : comments.length > 0 ? (
            <div className="space-y-4">
              {comments.map((c) => (
                <div key={c.id} className="p-4 bg-[var(--border-color)]/30 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {c.visitor.avatar ? (
                        <img 
                          src={c.visitor.avatar} 
                          alt={c.visitor.nickname}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                      ) : (
                        <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-sm">
                          {c.visitor.nickname.charAt(0).toUpperCase()}
                        </span>
                      )}
                      <span className="font-medium text-[var(--text-primary)]">{c.visitor.nickname}</span>
                    </div>
                    <span className="text-xs text-[var(--text-secondary)]">{formatRelativeTime(c.createdAt)}</span>
                  </div>
                  <p className="text-[var(--text-secondary)] mb-2">{c.content}</p>
                  
                  <button
                    type="button"
                    onClick={() => setReplyingTo(replyingTo === c.id ? null : c.id)}
                    className="text-xs text-primary hover:underline"
                  >
                    {replyingTo === c.id ? '取消回复' : '回复'}
                  </button>
                  
                  {c.replies && c.replies.length > 0 && (
                    <div className="mt-3 ml-4 space-y-2 border-l-2 border-[var(--border-color)] pl-3">
                      {c.replies.map((reply) => (
                        <div key={reply.id} className="py-2">
                          <div className="flex items-center gap-2 mb-1">
                            {reply.visitor.avatar ? (
                              <img 
                                src={reply.visitor.avatar} 
                                alt={reply.visitor.nickname}
                                className="w-5 h-5 rounded-full object-cover"
                              />
                            ) : (
                              <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-xs">
                                {reply.visitor.nickname.charAt(0).toUpperCase()}
                              </span>
                            )}
                            <span className="font-medium text-sm text-[var(--text-primary)]">{reply.visitor.nickname}</span>
                            <span className="text-xs text-[var(--text-secondary)]">{formatRelativeTime(reply.createdAt)}</span>
                          </div>
                          <p className="text-sm text-[var(--text-secondary)]">{reply.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {replyingTo === c.id && (
                    <div className="mt-3 flex gap-2">
                      <input
                        type="text"
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="写下你的回复..."
                        className="input-field flex-1 text-sm"
                        disabled={!isAuthenticated}
                      />
                      <button
                        type="button"
                        onClick={() => handleSubmitReply(c.id)}
                        className="btn-primary text-sm px-3"
                        disabled={!isAuthenticated || !replyContent.trim()}
                      >
                        发送
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-[var(--text-secondary)] py-8">暂无评论，来抢沙发吧~</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default ArticleDetailPage;
