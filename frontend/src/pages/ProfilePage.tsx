import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Form, Input, Button, message, Spin, Avatar } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from '../hooks/useAuth';
import { API, fetchWithAuth } from '../config/api';

interface ProfileForm {
  nickname: string;
  avatar: string;
}

interface PasswordForm {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ProfilePage: FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [profileForm] = Form.useForm<ProfileForm>();
  const [passwordForm] = Form.useForm<PasswordForm>();
  const { user, token, updateUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || !token) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const data = await fetchWithAuth<{ nickname: string; email: string; avatar: string }>(
          API.visitor.profile,
          token
        );
        profileForm.setFieldsValue({
          nickname: data.nickname,
          avatar: data.avatar || '',
        });
      } catch (error) {
        message.error('获取个人资料失败');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [isAuthenticated, token, profileForm, navigate]);

  const handleSaveProfile = async (values: ProfileForm) => {
    if (!token) return;

    setSaving(true);
    try {
      const data = await fetchWithAuth<{ nickname: string; avatar: string }>(
        API.visitor.updateProfile,
        token,
        {
          method: 'PUT',
          body: JSON.stringify(values),
        }
      );

      updateUser({ nickname: data.nickname, avatar: data.avatar });
      message.success('保存成功');
    } catch (error) {
      message.error('保存失败');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (values: PasswordForm) => {
    if (!token) return;

    if (values.newPassword !== values.confirmPassword) {
      message.error('两次输入的密码不一致');
      return;
    }

    setPasswordSaving(true);
    try {
      await fetchWithAuth<{ success: boolean }>(API.visitor.updatePassword, token, {
        method: 'PUT',
        body: JSON.stringify({
          oldPassword: values.oldPassword,
          newPassword: values.newPassword,
        }),
      });

      message.success('密码修改成功');
      passwordForm.resetFields();
    } catch (error) {
      message.error(error instanceof Error ? error.message : '密码修改失败');
    } finally {
      setPasswordSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-6 max-w-2xl">
          <div className="text-center py-12">
            <Spin size="large" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-6 max-w-2xl">
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-6">个人资料</h1>

        <Card className="card mb-6">
          <div className="flex items-center gap-4 mb-6">
            <Avatar
              src={user.avatar}
              icon={!user.avatar && <UserOutlined />}
              size={64}
              className="bg-primary/20"
            />
            <div>
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">{user.nickname}</h2>
              <p className="text-sm text-[var(--text-secondary)]">{user.email}</p>
            </div>
          </div>

          <Form form={profileForm} onFinish={handleSaveProfile} layout="vertical">
            <Form.Item
              name="nickname"
              label="昵称"
              rules={[
                { required: true, message: '请输入昵称' },
                { max: 20, message: '昵称最多20个字符' },
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="昵称" />
            </Form.Item>

            <Form.Item
              name="avatar"
              label="头像 URL"
              rules={[{ type: 'url', message: '请输入有效的 URL' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="https://example.com/avatar.png" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={saving}>
                保存资料
              </Button>
            </Form.Item>
          </Form>
        </Card>

        <Card className="card">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">修改密码</h3>

          <Form form={passwordForm} onFinish={handleChangePassword} layout="vertical">
            <Form.Item
              name="oldPassword"
              label="旧密码"
              rules={[
                { required: true, message: '请输入旧密码' },
                { min: 6, message: '密码至少6位' },
              ]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="旧密码" />
            </Form.Item>

            <Form.Item
              name="newPassword"
              label="新密码"
              rules={[
                { required: true, message: '请输入新密码' },
                { min: 6, message: '密码至少6位' },
              ]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="新密码" />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="确认新密码"
              rules={[
                { required: true, message: '请确认新密码' },
                { min: 6, message: '密码至少6位' },
              ]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="确认新密码" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={passwordSaving}>
                修改密码
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
