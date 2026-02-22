import type { FC } from 'react';
import { Link } from 'react-router-dom';

interface FooterProps {
  theme: 'light' | 'dark';
}

const Footer: FC<FooterProps> = ({ theme }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`mt-16 transition-colors duration-300 ${
      theme === 'light' ? 'bg-gray-100 border-t border-gray-200' : 'bg-[#1a1a1a] border-t border-[#333]'
    }`}>
      <div className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center mb-4">
              <img src="/logo.png" alt="logo" className="w-10 h-10 object-contain mr-3" />
              <h3 className={`text-xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>My Blog</h3>
            </div>
            <p className={`leading-relaxed ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
              一个简洁的个人博客，记录生活、分享技术。
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
              <a 
                href="https://github.com/oolongho" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  theme === 'light'
                    ? 'bg-gray-200 hover:bg-primary group'
                    : 'bg-[#2a2a2a] hover:bg-primary group'
                }`}
              >
                <svg className={`w-5 h-5 group-hover:text-gray-900 transition-colors ${
                  theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                }`} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
            </div>
            
            <p className="text-sm text-gray-500">
              © {currentYear} My Blog. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
