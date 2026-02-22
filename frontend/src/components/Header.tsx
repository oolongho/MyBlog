import type { FC } from 'react';
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

interface HeaderProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const Header: FC<HeaderProps> = ({ theme, toggleTheme }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `relative px-4 py-2 rounded-full font-medium transition-all duration-300 ${
      isActive
        ? 'bg-primary text-gray-900 shadow-md'
        : theme === 'light'
          ? 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          : 'text-gray-400 hover:bg-[#2a2a2a] hover:text-white'
    }`;

  const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `block px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
      isActive
        ? 'bg-primary text-gray-900'
        : theme === 'light'
          ? 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          : 'text-gray-400 hover:bg-[#2a2a2a] hover:text-white'
    }`;

  return (
    <header className={`shadow-lg sticky top-0 z-50 backdrop-blur-sm transition-colors duration-300 ${
      theme === 'light' ? 'bg-white border-b border-gray-200' : 'bg-[#1a1a1a] border-b border-[#333]'
    }`}>
      <div className="container mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold flex items-center group">
          <img src="/logo.png" alt="logo" className="w-10 h-10 object-contain mr-3" />
          <span className={`group-hover:text-primary transition-all duration-300 ${
            theme === 'light' ? 'text-gray-900' : 'text-white'
          }`}>My Blog</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2">
          <ul className="flex space-x-1">
            <li><NavLink to="/" className={navLinkClass}>首页</NavLink></li>
            <li><NavLink to="/articles" className={navLinkClass}>文章</NavLink></li>
            <li><NavLink to="/moments" className={navLinkClass}>说说</NavLink></li>
            <li><NavLink to="/links" className={navLinkClass}>友链</NavLink></li>
            <li><NavLink to="/about" className={navLinkClass}>关于</NavLink></li>
          </ul>
          
          <button
            onClick={toggleTheme}
            className={`ml-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-md ${
              theme === 'light' 
                ? 'bg-gray-100 hover:bg-gray-200' 
                : 'bg-[#2a2a2a] hover:bg-[#333]'
            }`}
            title={theme === 'light' ? '切换到夜间模式' : '切换到白天模式'}
          >
            {theme === 'light' ? (
              <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            )}
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={toggleTheme}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-md ${
              theme === 'light' 
                ? 'bg-gray-100 hover:bg-gray-200' 
                : 'bg-[#2a2a2a] hover:bg-[#333]'
            }`}
            title={theme === 'light' ? '切换到夜间模式' : '切换到白天模式'}
          >
            {theme === 'light' ? (
              <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            )}
          </button>
          
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-md ${
              theme === 'light' 
                ? 'bg-gray-100 hover:bg-gray-200' 
                : 'bg-[#2a2a2a] hover:bg-[#333]'
            }`}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <svg className={`w-5 h-5 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className={`w-5 h-5 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className={`md:hidden border-t ${
          theme === 'light' ? 'bg-white border-gray-200' : 'bg-[#1a1a1a] border-[#333]'
        }`}>
          <nav className="container mx-auto px-4 py-4">
            <ul className="space-y-2">
              <li><NavLink to="/" className={mobileNavLinkClass} onClick={() => setIsMenuOpen(false)}>首页</NavLink></li>
              <li><NavLink to="/articles" className={mobileNavLinkClass} onClick={() => setIsMenuOpen(false)}>文章</NavLink></li>
              <li><NavLink to="/moments" className={mobileNavLinkClass} onClick={() => setIsMenuOpen(false)}>说说</NavLink></li>
              <li><NavLink to="/links" className={mobileNavLinkClass} onClick={() => setIsMenuOpen(false)}>友链</NavLink></li>
              <li><NavLink to="/about" className={mobileNavLinkClass} onClick={() => setIsMenuOpen(false)}>关于</NavLink></li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
