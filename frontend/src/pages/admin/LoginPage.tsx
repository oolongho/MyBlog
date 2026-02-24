import type { FC } from 'react';
import { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { API } from '../../config/api';

interface LoginForm {
  username: string;
  password: string;
}

const AdminLoginPage: FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const onFinish = async (values: LoginForm) => {
    setLoading(true);
    try {
      const response = await fetch(API.auth.login, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        message.error(data.error || '登录失败');
        return;
      }

      login({ ...data.user, role: 'admin' }, data.token);
      message.success('登录成功');
      navigate('/admin');
    } catch (error) {
      message.error('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#141414',
    }}>
      <Card 
        style={{ 
          width: 400, 
          boxShadow: '0 4px 12px rgba(0,0,0,0.45)',
          background: '#1f1f1f',
          borderColor: '#303030',
        }}
        styles={{
          header: {
            background: '#1f1f1f',
            borderBottom: '1px solid #303030',
          },
          body: {
            background: '#1f1f1f',
          },
        }}
        title={
          <div style={{ textAlign: 'center', fontSize: 24, fontWeight: 'bold', color: '#fff' }}>
            MyBlog 管理后台
          </div>
        }
      >
        <Form
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input 
              prefix={<UserOutlined style={{ color: '#666' }} />} 
              placeholder="用户名"
              style={{ background: '#141414', borderColor: '#434343', color: '#fff' }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#666' }} />}
              placeholder="密码"
              style={{ background: '#141414', borderColor: '#434343', color: '#fff' }}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AdminLoginPage;
