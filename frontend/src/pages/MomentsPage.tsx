import type { FC } from 'react';
import { useState, useEffect, useCallback } from 'react';
import type { Moment } from '../types';
import { API, fetchApi } from '../config/api';
import { useAuth } from '../hooks/useAuth';

const MomentsPage: FC = () => {
  const [moments, setMoments] = useState<Moment[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedMoments, setLikedMoments] = useState<Set<number>>(new Set());
  const { isAuthenticated, token } = useAuth();

  useEffect(() => {
    const fetchMoments = async () => {
      try {
        const data = await fetchApi<Moment[]>(API.moments.list({ pageSize: 100 }));
        setMoments(data || []);
      } catch (error) {
        console.error('Failed to fetch moments:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMoments();
  }, []);

  const handleLike = useCallback(async (id: number) => {
    if (!isAuthenticated || !token) {
      alert('请先登录');
      return;
    }

    try {
      const result = await fetchApi<{ liked: boolean }>(API.moments.like(id), {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
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
                    {moment.time || moment.createdAt}
                  </time>
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
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MomentsPage;
