import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { Card, Form, Input, Button, message, Spin, Divider } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { Icon } from '@iconify/react';
import { useAuth } from '../../hooks/useAuth';
import { API, fetchWithAuth } from '../../config/api';

interface SocialLink {
  name: string;
  icon: string;
  url: string;
}

interface TimelineItem {
  year: string;
  title: string;
  description: string;
}

interface Settings {
  siteTitle: string;
  siteDescription: string;
  siteKeywords: string;
  siteAvatar: string;
  siteFavicon: string;
  footerText: string;
  announcement: string;
  profileNickname: string;
  profileTitle: string;
  profileBio: string;
  profileHobbies: string;
  profileSocialLinks: string;
  timelineItems: string;
  footerSiteName: string;
  footerDescription: string;
}

const SettingsPage: FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);
  const { token } = useAuth();

  useEffect(() => {
    const fetchSettings = async () => {
      if (!token) return;
      
      try {
        const data = await fetchWithAuth<Settings>(API.settings.all, token);
        form.setFieldsValue({
          siteTitle: data.siteTitle,
          siteDescription: data.siteDescription,
          siteKeywords: data.siteKeywords,
          siteAvatar: data.siteAvatar,
          siteFavicon: data.siteFavicon,
          footerText: data.footerText,
          announcement: data.announcement,
          profileNickname: data.profileNickname,
          profileTitle: data.profileTitle,
          profileBio: data.profileBio,
          profileHobbies: data.profileHobbies,
          footerSiteName: data.footerSiteName,
          footerDescription: data.footerDescription,
        });
        
        try {
          setSocialLinks(JSON.parse(data.profileSocialLinks || '[]'));
        } catch {
          setSocialLinks([]);
        }
        
        try {
          setTimelineItems(JSON.parse(data.timelineItems || '[]'));
        } catch {
          setTimelineItems([]);
        }
      } catch (error) {
        message.error('获取设置失败');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [token, form]);

  const handleAddSocialLink = () => {
    setSocialLinks([...socialLinks, { name: '', icon: '', url: '' }]);
  };

  const handleRemoveSocialLink = (index: number) => {
    setSocialLinks(socialLinks.filter((_, i) => i !== index));
  };

  const handleSocialLinkChange = (index: number, field: keyof SocialLink, value: string) => {
    const newLinks = [...socialLinks];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setSocialLinks(newLinks);
  };

  const handleAddTimelineItem = () => {
    setTimelineItems([...timelineItems, { year: '', title: '', description: '' }]);
  };

  const handleRemoveTimelineItem = (index: number) => {
    setTimelineItems(timelineItems.filter((_, i) => i !== index));
  };

  const handleTimelineChange = (index: number, field: keyof TimelineItem, value: string) => {
    const newItems = [...timelineItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setTimelineItems(newItems);
  };

  const handleSave = async (values: Record<string, string>) => {
    if (!token) return;
    
    setSaving(true);
    try {
      const settingsArray = [
        ...Object.entries(values).map(([key, value]) => ({
          key,
          value: value || '',
        })),
        { key: 'profileSocialLinks', value: JSON.stringify(socialLinks) },
        { key: 'timelineItems', value: JSON.stringify(timelineItems) },
      ];

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
        <Divider>网站基本信息</Divider>
        
        <Form.Item name="siteTitle" label="网站标题">
          <Input placeholder="My Blog" />
        </Form.Item>

        <Form.Item name="siteDescription" label="网站描述">
          <Input.TextArea rows={2} placeholder="网站简介，用于 SEO" />
        </Form.Item>

        <Form.Item name="siteKeywords" label="网站关键词">
          <Input placeholder="博客,技术,分享" />
        </Form.Item>

        <Form.Item name="siteAvatar" label="网站头像 URL">
          <Input placeholder="https://example.com/avatar.png" />
        </Form.Item>

        <Form.Item name="siteFavicon" label="Favicon URL">
          <Input placeholder="https://example.com/favicon.ico" />
        </Form.Item>

        <Divider>个人信息</Divider>
        
        <Form.Item name="profileNickname" label="昵称">
          <Input placeholder="oolongho" />
        </Form.Item>

        <Form.Item name="profileTitle" label="职位/身份">
          <Input placeholder="前端开发者 / 技术爱好者" />
        </Form.Item>

        <Form.Item name="profileBio" label="关于我">
          <Input.TextArea rows={5} placeholder="个人介绍..." />
        </Form.Item>

        <Form.Item name="profileHobbies" label="爱好（逗号分隔）">
          <Input placeholder="Minecraft,音乐,Java,守望先锋,编程,游戏,动漫,摄影" />
        </Form.Item>

        <Form.Item label="社交链接">
          <div className="space-y-3">
            {socialLinks.map((link, index) => (
              <div key={index} className="flex gap-2 items-start p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex-1 space-y-2">
                  <Input
                    placeholder="平台名称（如：GitHub）"
                    value={link.name}
                    onChange={(e) => handleSocialLinkChange(index, 'name', e.target.value)}
                  />
                  <div className="flex gap-2 items-center">
                    <Input
                      placeholder="图标名称（如：simple-icons:github）"
                      value={link.icon}
                      onChange={(e) => handleSocialLinkChange(index, 'icon', e.target.value)}
                    />
                    {link.icon && (
                      <div className="w-8 h-8 flex items-center justify-center border rounded">
                        <Icon icon={link.icon} className="text-lg" />
                      </div>
                    )}
                  </div>
                  <Input
                    placeholder="链接地址（如：https://github.com/username）"
                    value={link.url}
                    onChange={(e) => handleSocialLinkChange(index, 'url', e.target.value)}
                  />
                </div>
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleRemoveSocialLink(index)}
                />
              </div>
            ))}
            <Button type="dashed" icon={<PlusOutlined />} onClick={handleAddSocialLink}>
              添加社交链接
            </Button>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            图标名称可从 <a href="https://yesicon.app" target="_blank" rel="noopener noreferrer" className="text-primary">yesicon.app</a> 搜索获取
          </div>
        </Form.Item>

        <Divider>时间线</Divider>

        <Form.Item label="时间线项目">
          <div className="space-y-3">
            {timelineItems.map((item, index) => (
              <div key={index} className="flex gap-2 items-start p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex-1 space-y-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="年份"
                      value={item.year}
                      onChange={(e) => handleTimelineChange(index, 'year', e.target.value)}
                      style={{ width: 100 }}
                    />
                    <Input
                      placeholder="标题"
                      value={item.title}
                      onChange={(e) => handleTimelineChange(index, 'title', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                  <Input.TextArea
                    placeholder="描述"
                    value={item.description}
                    onChange={(e) => handleTimelineChange(index, 'description', e.target.value)}
                    rows={2}
                  />
                </div>
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleRemoveTimelineItem(index)}
                />
              </div>
            ))}
            <Button type="dashed" icon={<PlusOutlined />} onClick={handleAddTimelineItem}>
              添加时间线项目
            </Button>
          </div>
        </Form.Item>

        <Divider>页脚设置</Divider>

        <Form.Item name="footerSiteName" label="页脚网站名称">
          <Input placeholder="My Blog" />
        </Form.Item>

        <Form.Item name="footerDescription" label="页脚网站简介">
          <Input.TextArea rows={2} placeholder="一个简洁的个人博客，记录生活、分享技术。" />
        </Form.Item>

        <Form.Item name="footerText" label="版权信息">
          <Input placeholder="© 2024 My Blog. All rights reserved." />
        </Form.Item>

        <Divider>其他设置</Divider>

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
