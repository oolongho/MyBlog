import type { FC } from 'react';

const MomentsPage: FC = () => {
  const moments = [
    { id: 1, content: '今天天气真好，出去散步了一下，心情舒畅~', time: '2024-01-16 15:30', likes: 12, images: [] },
    { id: 2, content: '终于把博客搭建完成了，开心！使用 React + TypeScript + Tailwind CSS，感觉开发效率提升了不少。', time: '2024-01-15 20:45', likes: 28, images: [] },
    { id: 3, content: '推荐一本好书《深入理解计算机系统》，非常值得反复阅读。每次读都有新的收获。', time: '2024-01-13 10:20', likes: 45, images: [] },
    { id: 4, content: '今天学习了 React 18 的新特性，并发渲染真的很强大！', time: '2024-01-10 16:15', likes: 33, images: [] },
    { id: 5, content: '周末和朋友去爬山了，风景很美，空气清新，下次还想去！', time: '2024-01-08 18:00', likes: 56, images: [] },
    { id: 6, content: '开始学习 Rust 语言，感觉内存安全的概念很有意思，继续加油！', time: '2024-01-05 21:30', likes: 19, images: [] },
    { id: 7, content: '新年快乐！2024 年，新的开始，新的目标！', time: '2024-01-01 00:00', likes: 128, images: [] },
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-6 max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">说说</h1>
          <p className="text-[var(--text-secondary)]">记录生活的点点滴滴</p>
        </div>

        <div className="space-y-4">
          {moments.map((moment) => (
            <div key={moment.id} className="card p-6">
              <p className="text-[var(--text-primary)] leading-relaxed mb-4">
                {moment.content}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--text-secondary)]">{moment.time}</span>
                <button className="flex items-center gap-1 text-[var(--text-secondary)] hover:text-primary transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span className="text-sm">{moment.likes}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MomentsPage;
