import type { FC } from 'react';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Form, Input, Button, Card, message, Tabs } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useAuth } from '../hooks/useAuth';
import { API } from '../config/api';

interface LoginForm {
  email: string;
  password: string;
}

interface RegisterForm {
  nickname: string;
  email: string;
  password: string;
}

const AuthPage: FC = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const from = (location.state as { from?: string })?.from || '/';

  const handleLogin = async (values: LoginForm) => {
    setLoading(true);
    try {
      const response = await fetch(API.visitor.login, {
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

      login({ ...data.user, role: 'visitor' }, data.token);
      message.success('登录成功');
      navigate(from, { replace: true });
    } catch (error) {
      message.error('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (values: RegisterForm) => {
    setLoading(true);
    try {
      const response = await fetch(API.visitor.register, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        message.error(data.error || '注册失败');
        return;
      }

      login({ ...data.user, role: 'visitor' }, data.token);
      message.success('注册成功');
      navigate(from, { replace: true });
    } catch (error) {
      message.error('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center text-[var(--text-primary)] mb-8">
          {activeTab === 'login' ? '欢迎回来' : '创建账号'}
        </h1>

        <Card className="card">
          <Tabs
            activeKey={activeTab}
            onChange={(key) => setActiveTab(key as 'login' | 'register')}
            centered
            items={[
              {
                key: 'login',
                label: '登录',
                children: (
                  <Form name="login" onFinish={handleLogin} layout="vertical" size="large">
                    <Form.Item
                      name="email"
                      rules={[
                        { required: true, message: '请输入邮箱' },
                        { type: 'email', message: '请输入有效的邮箱地址' },
                      ]}
                    >
                      <Input prefix={<MailOutlined />} placeholder="邮箱" />
                    </Form.Item>

                    <Form.Item
                      name="password"
                      rules={[
                        { required: true, message: '请输入密码' },
                        { min: 6, message: '密码至少6位' },
                      ]}
                    >
                      <Input.Password prefix={<LockOutlined />} placeholder="密码" />
                    </Form.Item>

                    <Form.Item>
                      <Button type="primary" htmlType="submit" loading={loading} block>
                        登录
                      </Button>
                    </Form.Item>
                  </Form>
                ),
              },
              {
                key: 'register',
                label: '注册',
                children: (
                  <Form name="register" onFinish={handleRegister} layout="vertical" size="large">
                    <Form.Item
                      name="nickname"
                      rules={[
                        { required: true, message: '请输入昵称' },
                        { max: 20, message: '昵称最多20个字符' },
                      ]}
                    >
                      <Input prefix={<UserOutlined />} placeholder="昵称" />
                    </Form.Item>

                    <Form.Item
                      name="email"
                      rules={[
                        { required: true, message: '请输入邮箱' },
                        { type: 'email', message: '请输入有效的邮箱地址' },
                      ]}
                    >
                      <Input prefix={<MailOutlined />} placeholder="邮箱" />
                    </Form.Item>

                    <Form.Item
                      name="password"
                      rules={[
                        { required: true, message: '请输入密码' },
                        { min: 6, message: '密码至少6位' },
                      ]}
                    >
                      <Input.Password prefix={<LockOutlined />} placeholder="密码" />
                    </Form.Item>

                    <Form.Item>
                      <Button type="primary" htmlType="submit" loading={loading} block>
                        注册
                      </Button>
                    </Form.Item>
                  </Form>
                ),
              },
            ]}
          />
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;
