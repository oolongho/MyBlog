import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { Layout, Menu, Button, Avatar, Dropdown, theme } from 'antd';
import {
  DashboardOutlined,
  FileTextOutlined,
  PictureOutlined,
  LinkOutlined,
  CommentOutlined,
  SettingOutlined,
  LogoutOutlined,
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { API, fetchApi } from '../../config/api';

const { Header, Sider, Content } = Layout;

interface Settings {
  siteTitle: string;
}

interface AdminLayoutProps {
  children?: React.ReactNode;
}

const defaultSettings: Settings = {
  siteTitle: 'MyBlog',
};

const AdminLayout: FC<AdminLayoutProps> = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { token: { borderRadiusLG } } = theme.useToken();

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

  const menuItems = [
    { key: '/admin', icon: <DashboardOutlined />, label: '仪表盘' },
    { key: '/admin/articles', icon: <FileTextOutlined />, label: '文章管理' },
    { key: '/admin/moments', icon: <PictureOutlined />, label: '说说管理' },
    { key: '/admin/gallery', icon: <PictureOutlined />, label: '图库管理' },
    { key: '/admin/friends', icon: <LinkOutlined />, label: '友链管理' },
    { key: '/admin/comments', icon: <CommentOutlined />, label: '评论管理' },
    { key: '/admin/settings', icon: <SettingOutlined />, label: '系统设置' },
  ];

  const userMenuItems = [
    { key: 'profile', icon: <UserOutlined />, label: '个人信息' },
    { type: 'divider' as const },
    { key: 'logout', icon: <LogoutOutlined />, label: '退出登录', danger: true },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  const handleUserMenuClick = ({ key }: { key: string }) => {
    if (key === 'logout') {
    logout();
    navigate('/admin/login');
  } else if (key === 'profile') {
    navigate('/admin/settings');
  }
  };

  const getSelectedKey = () => {
    const path = location.pathname;
    if (path === '/admin') return ['/admin'];
    return [path];
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#141414' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        theme="dark"
        style={{ background: '#1f1f1f' }}
      >
        <div style={{ 
          height: 64, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          borderBottom: '1px solid #303030'
        }}>
          {collapsed ? (
            <span style={{ fontSize: 20, fontWeight: 'bold', color: '#1890ff' }}>{settings.siteTitle.charAt(0)}</span>
          ) : (
            <span style={{ fontSize: 18, fontWeight: 'bold', color: '#fff' }}>{settings.siteTitle}</span>
          )}
        </div>
        <Menu
          mode="inline"
          selectedKeys={getSelectedKey()}
          items={menuItems}
          onClick={handleMenuClick}
          style={{ borderRight: 0, background: '#1f1f1f' }}
          theme="dark"
        />
      </Sider>
      <Layout style={{ background: '#141414' }}>
        <Header style={{ 
          padding: '0 24px', 
          background: '#1f1f1f',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #303030'
        }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: 16, width: 64, height: 64, color: '#fff' }}
          />
          <Dropdown
            menu={{ items: userMenuItems, onClick: handleUserMenuClick }}
            placement="bottomRight"
          >
            <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, color: '#fff' }}>
              <Avatar src={user?.avatar} icon={<UserOutlined />} style={{ background: '#1890ff' }} />
              <span>{user?.nickname || '管理员'}</span>
            </div>
          </Dropdown>
        </Header>
        <Content style={{ 
          margin: 24, 
          padding: 24, 
          background: '#1f1f1f', 
          borderRadius: borderRadiusLG,
          minHeight: 280,
          overflow: 'auto'
        }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
