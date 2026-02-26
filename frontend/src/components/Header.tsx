import type { FC } from 'react';
import { useState, useCallback } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface HeaderProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

interface ThemeToggleButtonProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeToggleButton: FC<ThemeToggleButtonProps> = ({ theme, toggleTheme }) => (
  <button
    type="button"
    onClick={toggleTheme}
    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-md ${
      theme === 'light' 
        ? 'bg-gray-100 hover:bg-gray-200' 
        : 'bg-[#2a2a2a] hover:bg-[#333]'
    }`}
    aria-label={theme === 'light' ? '切换到夜间模式' : '切换到白天模式'}
  >
    {theme === 'light' ? (
      <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    )}
  </button>
);

const Header: FC<HeaderProps> = ({ theme, toggleTheme }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const navLinkClass = useCallback(({ isActive }: { isActive: boolean }) =>
    `relative px-4 py-2 rounded-full font-medium transition-all duration-300 ${
      isActive
        ? 'bg-primary text-gray-900 shadow-md'
        : theme === 'light'
          ? 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          : 'text-gray-400 hover:bg-[#2a2a2a] hover:text-white'
    }`, [theme]);

  const mobileNavLinkClass = useCallback(({ isActive }: { isActive: boolean }) =>
    `block px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
      isActive
        ? 'bg-primary text-gray-900'
        : theme === 'light'
          ? 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          : 'text-gray-400 hover:bg-[#2a2a2a] hover:text-white'
    }`, [theme]);

  const handleToggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  const handleCloseMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const handleLogout = useCallback(() => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/');
  }, [logout, navigate]);

  return (
    <header className={`shadow-lg sticky top-0 z-50 backdrop-blur-sm transition-colors duration-300 ${
      theme === 'light' ? 'bg-white border-b border-gray-200' : 'bg-[#1a1a1a] border-b border-[#333]'
    }`}>
      <div className="container mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold flex items-center group" aria-label="返回首页">
          <img src="/logo.png" alt="My Blog Logo" className="w-10 h-10 object-contain mr-3" loading="lazy" />
          <span className={`group-hover:text-primary transition-all duration-300 ${
            theme === 'light' ? 'text-gray-900' : 'text-white'
          }`}>My Blog</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-2" aria-label="主导航">
          <ul className="flex space-x-1" role="menubar">
            <li role="none"><NavLink to="/" className={navLinkClass} role="menuitem">首页</NavLink></li>
            <li role="none"><NavLink to="/articles" className={navLinkClass} role="menuitem">文章</NavLink></li>
            <li role="none"><NavLink to="/moments" className={navLinkClass} role="menuitem">说说</NavLink></li>
            <li role="none"><NavLink to="/gallery" className={navLinkClass} role="menuitem">图库</NavLink></li>
            <li role="none"><NavLink to="/links" className={navLinkClass} role="menuitem">友链</NavLink></li>
            <li role="none"><NavLink to="/about" className={navLinkClass} role="menuitem">关于</NavLink></li>
          </ul>
          
          <ThemeToggleButton theme={theme} toggleTheme={toggleTheme} />

          {isAuthenticated && user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsUserMenuOpen(prev => !prev)}
                className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-300 ${
                  theme === 'light' 
                    ? 'bg-gray-100 hover:bg-gray-200' 
                    : 'bg-[#2a2a2a] hover:bg-[#333]'
                }`}
              >
                {user.avatar ? (
                  <img src={user.avatar} alt={user.nickname} className="w-6 h-6 rounded-full object-cover" />
                ) : (
                  <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium">
                    {user.nickname.charAt(0).toUpperCase()}
                  </span>
                )}
                <span className={`text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                  {user.nickname}
                </span>
                <svg className={`w-4 h-4 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isUserMenuOpen && (
                <div className={`absolute right-0 mt-2 w-40 rounded-lg shadow-lg py-1 ${
                  theme === 'light' ? 'bg-white border border-gray-200' : 'bg-[#2a2a2a] border border-[#333]'
                }`}>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                      theme === 'light' 
                        ? 'text-gray-700 hover:bg-gray-100' 
                        : 'text-gray-300 hover:bg-[#333]'
                    }`}
                  >
                    退出登录
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                theme === 'light' 
                  ? 'bg-primary text-gray-900 hover:bg-primary/90' 
                  : 'bg-primary text-gray-900 hover:bg-primary/90'
              }`}
            >
              登录
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggleButton theme={theme} toggleTheme={toggleTheme} />
          
          <button
            type="button"
            onClick={handleToggleMenu}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-md ${
              theme === 'light' 
                ? 'bg-gray-100 hover:bg-gray-200' 
                : 'bg-[#2a2a2a] hover:bg-[#333]'
            }`}
            aria-label={isMenuOpen ? '关闭菜单' : '打开菜单'}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMenuOpen ? (
              <svg className={`w-5 h-5 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className={`w-5 h-5 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div 
          id="mobile-menu"
          className={`md:hidden border-t ${
            theme === 'light' ? 'bg-white border-gray-200' : 'bg-[#1a1a1a] border-[#333]'
          }`}
          role="menu"
        >
          <nav className="container mx-auto px-4 py-4" aria-label="移动端导航">
            <ul className="space-y-2">
              <li><NavLink to="/" className={mobileNavLinkClass} onClick={handleCloseMenu} role="menuitem">首页</NavLink></li>
              <li><NavLink to="/articles" className={mobileNavLinkClass} onClick={handleCloseMenu} role="menuitem">文章</NavLink></li>
              <li><NavLink to="/moments" className={mobileNavLinkClass} onClick={handleCloseMenu} role="menuitem">说说</NavLink></li>
              <li><NavLink to="/gallery" className={mobileNavLinkClass} onClick={handleCloseMenu} role="menuitem">图库</NavLink></li>
              <li><NavLink to="/links" className={mobileNavLinkClass} onClick={handleCloseMenu} role="menuitem">友链</NavLink></li>
              <li><NavLink to="/about" className={mobileNavLinkClass} onClick={handleCloseMenu} role="menuitem">关于</NavLink></li>
            </ul>
            
            {isAuthenticated && user ? (
              <div className={`mt-4 pt-4 border-t ${theme === 'light' ? 'border-gray-200' : 'border-[#333]'}`}>
                <div className="flex items-center gap-2 mb-3">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.nickname} className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-medium">
                      {user.nickname.charAt(0).toUpperCase()}
                    </span>
                  )}
                  <span className={`font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                    {user.nickname}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className={`block w-full text-left px-4 py-2 rounded-lg text-sm transition-colors ${
                    theme === 'light' 
                      ? 'text-gray-700 hover:bg-gray-100' 
                      : 'text-gray-300 hover:bg-[#333]'
                  }`}
                >
                  退出登录
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={handleCloseMenu}
                className={`block mt-4 text-center px-4 py-2 rounded-lg font-medium ${
                  'bg-primary text-gray-900'
                }`}
              >
                登录
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
