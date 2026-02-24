import type { FC } from 'react';
import type { TimelineItem } from '../types';

const hobbies = [
  'Minecraft', '音乐', 'Java', '守望先锋', '编程', '游戏', '动漫', '摄影'
];

const timeline: TimelineItem[] = [
  { year: '2024', events: ['开始搭建个人博客 - 使用 React + TypeScript + Tailwind CSS 搭建了这个博客'] },
  { year: '2023', events: ['深入学习前端技术 - 专注于 React 生态系统，学习 TypeScript 和现代前端工具链'] },
  { year: '2022', events: ['开始学习编程 - 从零开始学习编程，发现了对前端开发的热爱'] },
];

const AboutPage: FC = () => {
  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-6 max-w-4xl">
        <section className="card p-8 mb-8" aria-labelledby="profile-heading">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <img src="/logo.png" alt="oolongho 的头像" className="w-32 h-32 object-contain" loading="lazy" />
            <div className="text-center md:text-left">
              <h1 id="profile-heading" className="text-3xl font-bold text-[var(--text-primary)] mb-2">oolongho</h1>
              <p className="text-[var(--text-secondary)] mb-4">前端开发者 / 技术爱好者</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                <a
                  href="https://github.com/oolongho"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-[var(--border-color)] rounded-lg text-sm text-[var(--text-primary)] hover:bg-primary hover:text-gray-900 transition-all duration-300 flex items-center gap-2"
                  aria-label="访问 oolongho 的 GitHub 主页"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </section>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <section className="card p-6" aria-labelledby="about-heading">
            <h2 id="about-heading" className="text-xl font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              关于我
            </h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              你好！我是 oolongho，一个热爱技术、热爱生活的开发者。
              <br /><br />
              我喜欢学习新技术，尤其对前端开发充满热情。在这个博客里，我会分享我的技术学习心得、生活感悟，以及一些有趣的项目。
              <br /><br />
              如果你对我的文章感兴趣，欢迎留言交流！
            </p>
          </section>

          <section className="card p-6" aria-labelledby="hobbies-heading">
            <h2 id="hobbies-heading" className="text-xl font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              爱好
            </h2>
            <div className="flex flex-wrap gap-2" role="list" aria-label="爱好列表">
              {hobbies.map((hobby) => (
                <span
                  key={hobby}
                  role="listitem"
                  className="px-4 py-2 bg-[var(--border-color)] rounded-full text-sm text-[var(--text-primary)] hover:bg-primary hover:text-gray-900 transition-all duration-300 cursor-default"
                >
                  {hobby}
                </span>
              ))}
            </div>
          </section>
        </div>

        <section className="card p-6" aria-labelledby="timeline-heading">
          <h2 id="timeline-heading" className="text-xl font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            时间线
          </h2>
          <div className="relative" role="list" aria-label="时间线">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-primary/20" aria-hidden="true" />
            <div className="space-y-8">
              {timeline.map((item) => (
                <article key={item.year} className="relative pl-12" role="listitem">
                  <div className="absolute left-2 w-5 h-5 bg-primary rounded-full border-4 border-[var(--card-bg)]" aria-hidden="true" />
                  <div className="card p-4 ml-2">
                    <time className="text-sm text-primary font-medium" dateTime={item.year}>{item.year}</time>
                    <h3 className="font-semibold text-[var(--text-primary)] mt-1">{item.events[0].split(' - ')[0]}</h3>
                    <p className="text-sm text-[var(--text-secondary)] mt-1">{item.events[0].split(' - ')[1] || item.events[0]}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
