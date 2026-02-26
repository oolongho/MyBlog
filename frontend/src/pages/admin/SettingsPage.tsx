import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { Card, Form, Input, Button, message, Spin, Divider } from 'antd';
import { useAuth } from '../../hooks/useAuth';
import { API, fetchWithAuth } from '../../config/api';

interface Settings {
  siteTitle: string;
  siteDescription: string;
  siteKeywords: string;
  siteAuthor: string;
  siteAvatar: string;
  siteFavicon: string;
  socialGithub: string;
  socialTwitter: string;
  socialEmail: string;
  footerText: string;
  announcement: string;
}

const SettingsPage: FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();
  const { token } = useAuth();

  useEffect(() => {
    const fetchSettings = async () => {
      if (!token) return;
      
      try {
        const data = await fetchWithAuth<Settings>(API.settings.all, token);
        form.setFieldsValue(data);
      } catch (error) {
        message.error('获取设置失败');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [token, form]);

  const handleSave = async (values: Settings) => {
    if (!token) return;
    
    setSaving(true);
    try {
      const settingsArray = Object.entries(values).map(([key, value]) => ({
        key,
        value: value || '',
      }));

      await fetchWithAuth(API.settings.update, token, {
        method: 'PUT',
        body: JSON.stringify(settingsArray),
      });

      message.success('保存成功');
    } catch (error) {
      message.error('保存失败');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Card title="网站设置">
      <Form form={form} onFinish={handleSave} layout="vertical">
        <Divider>基本信息</Divider>
        
        <Form.Item name="siteTitle" label="网站标题">
          <Input placeholder="My Blog" />
        </Form.Item>

        <Form.Item name="siteDescription" label="网站描述">
          <Input.TextArea rows={2} placeholder="网站简介，用于 SEO" />
        </Form.Item>

        <Form.Item name="siteKeywords" label="网站关键词">
          <Input placeholder="博客,技术,分享" />
        </Form.Item>

        <Form.Item name="siteAuthor" label="作者名称">
          <Input placeholder="oolongho" />
        </Form.Item>

        <Form.Item name="siteAvatar" label="网站头像 URL">
          <Input placeholder="https://example.com/avatar.png" />
        </Form.Item>

        <Form.Item name="siteFavicon" label="Favicon URL">
          <Input placeholder="https://example.com/favicon.ico" />
        </Form.Item>

        <Divider>社交链接</Divider>

        <Form.Item name="socialGithub" label="GitHub">
          <Input placeholder="https://github.com/username" />
        </Form.Item>

        <Form.Item name="socialTwitter" label="Twitter">
          <Input placeholder="https://twitter.com/username" />
        </Form.Item>

        <Form.Item name="socialEmail" label="邮箱">
          <Input placeholder="your@email.com" />
        </Form.Item>

        <Divider>其他设置</Divider>

        <Form.Item name="footerText" label="页脚文字">
          <Input.TextArea rows={2} placeholder="© 2024 My Blog. All rights reserved." />
        </Form.Item>

        <Form.Item name="announcement" label="公告">
          <Input.TextArea rows={3} placeholder="网站公告，显示在首页顶部" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={saving}>
            保存设置
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default SettingsPage;
