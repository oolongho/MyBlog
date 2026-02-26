import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { API, fetchApi } from '../config/api';

interface SocialLink {
  name: string;
  icon: string;
  url: string;
}

interface TimelineItem {
  year: string;
  title: string;
  description: string;
}

interface Settings {
  profileNickname: string;
  profileTitle: string;
  profileBio: string;
  profileHobbies: string;
  profileSocialLinks: string;
  timelineItems: string;
}

const defaultSettings: Settings = {
  profileNickname: 'oolongho',
  profileTitle: '前端开发者 / 技术爱好者',
  profileBio: '你好！我是 oolongho，一个热爱技术、热爱生活的开发者。',
  profileHobbies: 'Minecraft,音乐,Java,守望先锋,编程,游戏,动漫,摄影',
  profileSocialLinks: '[]',
  timelineItems: '[]',
};

const AboutPage: FC = () => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await fetchApi<Settings>(API.settings.public);
        setSettings({ ...defaultSettings, ...data });
      } catch (error) {
        console.error('Failed to fetch settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const hobbies = settings.profileHobbies.split(',').map(h => h.trim()).filter(Boolean);
  
  let socialLinks: SocialLink[] = [];
  try {
    socialLinks = JSON.parse(settings.profileSocialLinks || '[]');
  } catch {
    socialLinks = [];
  }

  let timeline: TimelineItem[] = [];
  try {
    timeline = JSON.parse(settings.timelineItems || '[]');
  } catch {
    timeline = [];
  }

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

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-6 max-w-4xl">
        <section className="card p-8 mb-8" aria-labelledby="profile-heading">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <img src="/logo.png" alt={`${settings.profileNickname} 的头像`} className="w-32 h-32 object-contain" loading="lazy" />
            <div className="text-center md:text-left">
              <h1 id="profile-heading" className="text-3xl font-bold text-[var(--text-primary)] mb-2">{settings.profileNickname}</h1>
              <p className="text-[var(--text-secondary)] mb-4">{settings.profileTitle}</p>
              {socialLinks.length > 0 && (
                <div className="flex flex-wrap justify-center md:justify-start gap-2">
                  {socialLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-[var(--border-color)] rounded-lg text-sm text-[var(--text-primary)] hover:bg-primary hover:text-gray-900 transition-all duration-300 flex items-center gap-2"
                      aria-label={`访问 ${settings.profileNickname} 的 ${link.name} 主页`}
                    >
                      <Icon icon={link.icon} className="w-5 h-5" />
                      {link.name}
                    </a>
                  ))}
                </div>
              )}
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
            <p className="text-[var(--text-secondary)] leading-relaxed whitespace-pre-line">
              {settings.profileBio}
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

        {timeline.length > 0 && (
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
                {timeline.map((item, index) => (
                  <article key={index} className="relative pl-12" role="listitem">
                    <div className="absolute left-2 w-5 h-5 bg-primary rounded-full border-4 border-[var(--card-bg)]" aria-hidden="true" />
                    <div className="card p-4 ml-2">
                      <time className="text-sm text-primary font-medium" dateTime={item.year}>{item.year}</time>
                      <h3 className="font-semibold text-[var(--text-primary)] mt-1">{item.title}</h3>
                      <p className="text-sm text-[var(--text-secondary)] mt-1">{item.description}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default AboutPage;
