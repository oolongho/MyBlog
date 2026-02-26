import type { FC } from 'react';
import { useState, useEffect, useCallback } from 'react';
import type { Moment } from '../types';
import { API, fetchApi, fetchWithAuth } from '../config/api';
import { useAuth } from '../hooks/useAuth';
import { formatRelativeTime } from '../utils/date';

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

interface MomentWithComments extends Moment {
  comments?: Comment[];
  commentCount?: number;
}

const MomentsPage: FC = () => {
  const [moments, setMoments] = useState<MomentWithComments[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedMoments, setLikedMoments] = useState<Set<number>>(new Set());
  const [expandedComments, setExpandedComments] = useState<Set<number>>(new Set());
  const [commentInputs, setCommentInputs] = useState<Record<number, string>>({});
  const [commentsData, setCommentsData] = useState<Record<number, Comment[]>>({});
  const [replyingTo, setReplyingTo] = useState<Record<number, number | null>>({});
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});
  const { isAuthenticated, token } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [momentsData, likedData] = await Promise.all([
          fetchApi<MomentWithComments[]>(API.moments.list({ pageSize: 50 })),
          isAuthenticated && token
            ? fetchWithAuth<number[]>(API.moments.liked, token).catch(() => [])
            : Promise.resolve([]),
        ]);
        
        setMoments(momentsData || []);
        setLikedMoments(new Set(likedData));
      } catch (error) {
        console.error('Failed to fetch moments:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isAuthenticated, token]);

  const handleLike = useCallback(async (id: number) => {
    if (!isAuthenticated || !token) {
      alert('请先登录');
      return;
    }

    try {
      const result = await fetchWithAuth<{ liked: boolean }>(API.moments.like(id), token!, {
        method: 'POST',
      });

      setLikedMoments(prev => {
        const newSet = new Set(prev);
        if (result.liked) {
          newSet.add(id);
        } else {
          newSet.delete(id);
        }
        return newSet;
      });

      setMoments(prev => prev.map(m => {
        if (m.id === id) {
          return { ...m, likes: result.liked ? m.likes + 1 : m.likes - 1 };
        }
        return m;
      }));
    } catch (error) {
      console.error('Failed to like moment:', error);
    }
  }, [isAuthenticated, token]);

  const toggleComments = useCallback(async (momentId: number) => {
    if (expandedComments.has(momentId)) {
      setExpandedComments(prev => {
        const newSet = new Set(prev);
        newSet.delete(momentId);
        return newSet;
      });
    } else {
      setExpandedComments(prev => new Set(prev).add(momentId));
      if (!commentsData[momentId]) {
        try {
          const comments = await fetchApi<Comment[]>(API.comments.list({ momentId, pageSize: 50 }));
          setCommentsData(prev => ({ ...prev, [momentId]: comments || [] }));
        } catch (error) {
          console.error('Failed to fetch comments:', error);
        }
      }
    }
  }, [expandedComments, commentsData]);

  const handleSubmitComment = useCallback(async (momentId: number, parentId?: number) => {
    const content = parentId 
      ? replyInputs[`${momentId}-${parentId}`]?.trim()
      : commentInputs[momentId]?.trim();
    
    if (!content) return;
    
    if (!isAuthenticated || !token) {
      alert('请先登录');
      return;
    }

    try {
      const newComment = await fetchWithAuth<Comment>(API.comments.create, token!, {
        method: 'POST',
        body: JSON.stringify({
          content,
          momentId,
          parentId,
        }),
      });
      
      if (parentId) {
        setCommentsData(prev => ({
          ...prev,
          [momentId]: prev[momentId]?.map(c => {
            if (c.id === parentId) {
              return { ...c, replies: [...(c.replies || []), newComment] };
            }
            return c;
          }) || [],
        }));
        setReplyInputs(prev => ({ ...prev, [`${momentId}-${parentId}`]: '' }));
        setReplyingTo(prev => ({ ...prev, [momentId]: null }));
      } else {
        setCommentsData(prev => ({
          ...prev,
          [momentId]: [newComment, ...(prev[momentId] || [])],
        }));
        setCommentInputs(prev => ({ ...prev, [momentId]: '' }));
      }
      
      setMoments(prev => prev.map(m => {
        if (m.id === momentId) {
          return { ...m, commentCount: (m.commentCount || 0) + 1 };
        }
        return m;
      }));
    } catch (error) {
      alert('评论失败，请稍后重试');
    }
  }, [commentInputs, replyInputs, isAuthenticated, token]);

  if (loading) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="text-center py-12">
            <p className="text-[var(--text-secondary)]">加载中...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-6 max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">说说</h1>
          <p className="text-[var(--text-secondary)]">记录生活的点点滴滴</p>
        </div>

        <div className="space-y-4">
          {moments.map((moment) => {
            const isLiked = likedMoments.has(moment.id);
            const images = moment.images || [];
            const isExpanded = expandedComments.has(moment.id);
            const comments = commentsData[moment.id] || [];

            return (
              <article key={moment.id} className="card p-6">
                <p className="text-[var(--text-primary)] leading-relaxed mb-4">
                  {moment.content}
                </p>
                {images.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {images.slice(0, 9).map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt=""
                        className="w-full aspect-square object-cover rounded-lg"
                        loading="lazy"
                      />
                    ))}
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <time className="text-sm text-[var(--text-secondary)]" dateTime={moment.createdAt}>
                    {formatRelativeTime(moment.createdAt)}
                  </time>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => toggleComments(moment.id)}
                      className="flex items-center gap-1 text-[var(--text-secondary)] hover:text-primary transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L5 20l1.395-3.72C5.512 15.042 5 13.574 5 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <span className="text-sm">{moment.commentCount || 0}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleLike(moment.id)}
                      className={`flex items-center gap-1 transition-colors ${
                        isLiked
                          ? 'text-primary'
                          : 'text-[var(--text-secondary)] hover:text-primary'
                      }`}
                      aria-label={`点赞，当前 ${moment.likes} 个赞，${isLiked ? '已点赞' : '未点赞'}`}
                      aria-pressed={isLiked}
                    >
                      <svg
                        className="w-5 h-5"
                        fill={isLiked ? 'currentColor' : 'none'}
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span className="text-sm" aria-live="polite">{moment.likes}</span>
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-[var(--border-color)]">
                    <div className="mb-4">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={commentInputs[moment.id] || ''}
                          onChange={(e) => setCommentInputs(prev => ({ ...prev, [moment.id]: e.target.value }))}
                          placeholder={isAuthenticated ? "写下你的评论..." : "请先登录后评论"}
                          className="input-field flex-1"
                          disabled={!isAuthenticated}
                        />
                        <button
                          type="button"
                          onClick={() => handleSubmitComment(moment.id)}
                          className={`btn-primary text-sm px-3 ${!isAuthenticated ? 'opacity-50 cursor-not-allowed' : ''}`}
                          disabled={!isAuthenticated || !(commentInputs[moment.id]?.trim())}
                        >
                          发送
                        </button>
                      </div>
                    </div>
                    
                    {comments.length > 0 ? (
                      <div className="space-y-3">
                        {comments.map((c) => (
                          <div key={c.id}>
                            <div className="flex items-start gap-2">
                              {c.visitor.avatar ? (
                                <img 
                                  src={c.visitor.avatar} 
                                  alt={c.visitor.nickname}
                                  className="w-6 h-6 rounded-full object-cover flex-shrink-0"
                                />
                              ) : (
                                <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs flex-shrink-0">
                                  {c.visitor.nickname.charAt(0).toUpperCase()}
                                </span>
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-sm text-[var(--text-primary)]">{c.visitor.nickname}</span>
                                  <span className="text-xs text-[var(--text-secondary)]">{formatRelativeTime(c.createdAt)}</span>
                                </div>
                                <p className="text-sm text-[var(--text-secondary)]">{c.content}</p>
                                <button
                                  type="button"
                                  onClick={() => setReplyingTo(prev => ({ ...prev, [moment.id]: replyingTo[moment.id] === c.id ? null : c.id }))}
                                  className="text-xs text-primary hover:underline mt-1"
                                >
                                  {replyingTo[moment.id] === c.id ? '取消回复' : '回复'}
                                </button>
                              </div>
                            </div>
                            
                            {c.replies && c.replies.length > 0 && (
                              <div className="ml-8 mt-2 space-y-2 border-l-2 border-[var(--border-color)] pl-3">
                                {c.replies.map((reply) => (
                                  <div key={reply.id} className="flex items-start gap-2">
                                    {reply.visitor.avatar ? (
                                      <img 
                                        src={reply.visitor.avatar} 
                                        alt={reply.visitor.nickname}
                                        className="w-5 h-5 rounded-full object-cover flex-shrink-0"
                                      />
                                    ) : (
                                      <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-xs flex-shrink-0">
                                        {reply.visitor.nickname.charAt(0).toUpperCase()}
                                      </span>
                                    )}
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2">
                                        <span className="font-medium text-xs text-[var(--text-primary)]">{reply.visitor.nickname}</span>
                                        <span className="text-xs text-[var(--text-secondary)]">{formatRelativeTime(reply.createdAt)}</span>
                                      </div>
                                      <p className="text-xs text-[var(--text-secondary)]">{reply.content}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                            
                            {replyingTo[moment.id] === c.id && (
                              <div className="ml-8 mt-2 flex gap-2">
                                <input
                                  type="text"
                                  value={replyInputs[`${moment.id}-${c.id}`] || ''}
                                  onChange={(e) => setReplyInputs(prev => ({ ...prev, [`${moment.id}-${c.id}`]: e.target.value }))}
                                  placeholder="写下你的回复..."
                                  className="input-field flex-1 text-sm"
                                  disabled={!isAuthenticated}
                                />
                                <button
                                  type="button"
                                  onClick={() => handleSubmitComment(moment.id, c.id)}
                                  className="btn-primary text-xs px-2"
                                  disabled={!isAuthenticated || !(replyInputs[`${moment.id}-${c.id}`]?.trim())}
                                >
                                  发送
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-sm text-[var(--text-secondary)] py-4">暂无评论</p>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MomentsPage;
