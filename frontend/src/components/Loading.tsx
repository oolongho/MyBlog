import type { FC } from 'react';

const Loading: FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" style={{ borderTopColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: 'transparent', borderLeftColor: '#00cc66' }} />
        <p className="text-[var(--text-secondary)]">加载中...</p>
      </div>
    </div>
  );
};

export default Loading;
