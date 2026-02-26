import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { API, fetchApi } from '../config/api';

interface SocialLink {
  name: string;
  icon: string;
  url: string;
}

interface Settings {
  footerSiteName: string;
  footerDescription: string;
  profileSocialLinks: string;
}

interface FooterProps {
  theme: 'light' | 'dark';
}

const defaultSettings: Settings = {
  footerSiteName: 'My Blog',
  footerDescription: '一个简洁的个人博客，记录生活、分享技术。',
  profileSocialLinks: '[]',
};

const Footer: FC<FooterProps> = ({ theme }) => {
  const currentYear = new Date().getFullYear();
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await fetchApi<Settings>(API.settings.public);
        setSettings({ ...defaultSettings, ...data });
      } catch (error) {
        console.error('Failed to fetch settings:', error);
      }
    };

    fetchSettings();
  }, []);

  let socialLinks: SocialLink[] = [];
  try {
    socialLinks = JSON.parse(settings.profileSocialLinks || '[]');
  } catch {
    socialLinks = [];
  }

  return (
    <footer className={`mt-16 transition-colors duration-300 ${
      theme === 'light' ? 'bg-gray-100 border-t border-gray-200' : 'bg-[#1a1a1a] border-t border-[#333]'
    }`}>
      <div className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center mb-4">
              <img src="/logo.png" alt="logo" className="w-10 h-10 object-contain mr-3" />
              <h3 className={`text-xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{settings.footerSiteName}</h3>
            </div>
            <p className={`leading-relaxed ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
              {settings.footerDescription}
            </p>
          </div>
          
          <div>
            <h4 className={`text-lg font-semibold mb-4 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>快速链接</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className={`flex items-center gap-2 transition-colors ${
                  theme === 'light' ? 'text-gray-600 hover:text-primary' : 'text-gray-400 hover:text-primary'
                }`}>
                  <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                  首页
                </Link>
              </li>
              <li>
                <Link to="/articles" className={`flex items-center gap-2 transition-colors ${
                  theme === 'light' ? 'text-gray-600 hover:text-primary' : 'text-gray-400 hover:text-primary'
                }`}>
                  <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                  文章
                </Link>
              </li>
              <li>
                <Link to="/moments" className={`flex items-center gap-2 transition-colors ${
                  theme === 'light' ? 'text-gray-600 hover:text-primary' : 'text-gray-400 hover:text-primary'
                }`}>
                  <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                  说说
                </Link>
              </li>
              <li>
                <Link to="/about" className={`flex items-center gap-2 transition-colors ${
                  theme === 'light' ? 'text-gray-600 hover:text-primary' : 'text-gray-400 hover:text-primary'
                }`}>
                  <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                  关于
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className={`text-lg font-semibold mb-4 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>技术栈</h4>
            <div className="flex flex-wrap gap-2">
              {['React', 'TypeScript', 'Tailwind CSS', 'Vite'].map((tech) => (
                <span 
                  key={tech}
                  className={`px-3 py-1 rounded-full text-sm transition-all duration-300 ${
                    theme === 'light'
                      ? 'bg-gray-200 text-gray-600 hover:bg-primary/20 hover:text-primary'
                      : 'bg-[#2a2a2a] text-gray-400 hover:bg-primary/20 hover:text-primary'
                  }`}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        <div className={`pt-8 ${theme === 'light' ? 'border-t border-gray-200' : 'border-t border-[#333]'}`}>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-4">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    theme === 'light'
                      ? 'bg-gray-200 hover:bg-primary group'
                      : 'bg-[#2a2a2a] hover:bg-primary group'
                  }`}
                  aria-label={`访问 ${link.name}`}
                >
                  <Icon icon={link.icon} className={`w-5 h-5 group-hover:text-gray-900 transition-colors ${
                    theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                  }`} />
                </a>
              ))}
            </div>
            
            <p className="text-sm text-gray-500">
              © {currentYear} {settings.footerSiteName}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
