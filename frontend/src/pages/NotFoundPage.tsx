import type { FC } from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center py-8">
      <div className="text-center px-6">
        <div className="mb-8">
          <span className="text-9xl font-bold gradient-text">404</span>
        </div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
          页面未找到
        </h1>
        <p className="text-[var(--text-secondary)] mb-8 max-w-md mx-auto">
          抱歉，你访问的页面不存在或已被移除。请检查网址是否正确，或返回首页继续浏览。
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/" className="btn-primary inline-flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            返回首页
          </Link>
          <Link to="/articles" className="btn-secondary inline-flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            浏览文章
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
