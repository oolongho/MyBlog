import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider, theme as antdTheme } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ArticlesPage from './pages/ArticlesPage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import MomentsPage from './pages/MomentsPage';
import GalleryPage from './pages/GalleryPage';
import LinksPage from './pages/LinksPage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';
import AdminLayout from './components/admin/AdminLayout';
import ProtectedRoute from './components/admin/ProtectedRoute';
import AdminLoginPage from './pages/admin/LoginPage';
import DashboardPage from './pages/admin/DashboardPage';
import ArticleManagePage from './pages/admin/ArticleManagePage';
import MomentManagePage from './pages/admin/MomentManagePage';
import GalleryManagePage from './pages/admin/GalleryManagePage';
import FriendManagePage from './pages/admin/FriendManagePage';
import CommentManagePage from './pages/admin/CommentManagePage';

const App: FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/*"
          element={
            <ConfigProvider
              locale={zhCN}
              theme={{
                algorithm: theme === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
                token: { colorPrimary: '#1890ff' },
              }}
            >
              <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-main)' }}>
                <Header theme={theme} toggleTheme={toggleTheme} />
                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/articles" element={<ArticlesPage />} />
                    <Route path="/articles/:id" element={<ArticleDetailPage />} />
                    <Route path="/moments" element={<MomentsPage />} />
                    <Route path="/gallery" element={<GalleryPage />} />
                    <Route path="/links" element={<LinksPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </main>
                <Footer theme={theme} />
              </div>
            </ConfigProvider>
          }
        />
        <Route
          path="/admin/login"
          element={
            <ConfigProvider
              locale={zhCN}
              theme={{
                algorithm: antdTheme.darkAlgorithm,
                token: { colorPrimary: '#1890ff' },
              }}
            >
              <AdminLoginPage />
            </ConfigProvider>
          }
        />
        <Route
          path="/admin"
          element={
            <ConfigProvider
              locale={zhCN}
              theme={{
                algorithm: antdTheme.darkAlgorithm,
                token: { colorPrimary: '#1890ff' },
              }}
            >
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            </ConfigProvider>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="articles" element={<ArticleManagePage />} />
          <Route path="moments" element={<MomentManagePage />} />
          <Route path="gallery" element={<GalleryManagePage />} />
          <Route path="friends" element={<FriendManagePage />} />
          <Route path="comments" element={<CommentManagePage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
