import type { FC } from 'react';
import { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider, theme as antdTheme } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import Header from './components/Header';
import Footer from './components/Footer';
import Loading from './components/Loading';

const HomePage = lazy(() => import('./pages/HomePage'));
const ArticlesPage = lazy(() => import('./pages/ArticlesPage'));
const ArticleDetailPage = lazy(() => import('./pages/ArticleDetailPage'));
const MomentsPage = lazy(() => import('./pages/MomentsPage'));
const GalleryPage = lazy(() => import('./pages/GalleryPage'));
const LinksPage = lazy(() => import('./pages/LinksPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

const AdminLayout = lazy(() => import('./components/admin/AdminLayout'));
const ProtectedRoute = lazy(() => import('./components/admin/ProtectedRoute'));
const AdminLoginPage = lazy(() => import('./pages/admin/LoginPage'));
const DashboardPage = lazy(() => import('./pages/admin/DashboardPage'));
const ArticleManagePage = lazy(() => import('./pages/admin/ArticleManagePage'));
const MomentManagePage = lazy(() => import('./pages/admin/MomentManagePage'));
const GalleryManagePage = lazy(() => import('./pages/admin/GalleryManagePage'));
const FriendManagePage = lazy(() => import('./pages/admin/FriendManagePage'));
const CommentManagePage = lazy(() => import('./pages/admin/CommentManagePage'));
const SettingsPage = lazy(() => import('./pages/admin/SettingsPage'));

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
                token: { colorPrimary: '#00cc66' },
              }}
            >
              <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-main)' }}>
                <Header theme={theme} toggleTheme={toggleTheme} />
                <main className="flex-1">
                  <Suspense fallback={<Loading />}>
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/articles" element={<ArticlesPage />} />
                      <Route path="/articles/:id" element={<ArticleDetailPage />} />
                      <Route path="/moments" element={<MomentsPage />} />
                      <Route path="/gallery" element={<GalleryPage />} />
                      <Route path="/links" element={<LinksPage />} />
                      <Route path="/about" element={<AboutPage />} />
                      <Route path="/login" element={<AuthPage />} />
                      <Route path="/profile" element={<ProfilePage />} />
                      <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                  </Suspense>
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
                token: { colorPrimary: '#00cc66' },
              }}
            >
              <Suspense fallback={<Loading />}>
                <AdminLoginPage />
              </Suspense>
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
                token: { colorPrimary: '#00cc66' },
              }}
            >
              <Suspense fallback={<Loading />}>
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              </Suspense>
            </ConfigProvider>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="articles" element={<ArticleManagePage />} />
          <Route path="moments" element={<MomentManagePage />} />
          <Route path="gallery" element={<GalleryManagePage />} />
          <Route path="friends" element={<FriendManagePage />} />
          <Route path="comments" element={<CommentManagePage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
