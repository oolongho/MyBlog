import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, List, Tag, Skeleton } from 'antd';
import {
  FileTextOutlined,
  EyeOutlined,
  HeartOutlined,
  CommentOutlined,
} from '@ant-design/icons';
import { API } from '../../config/api';

interface Stats {
  articleCount: number;
  totalViews: number;
  momentCount: number;
  totalLikes: number;
  commentCount: number;
}

interface RecentArticle {
  id: number;
  title: string;
  category: string;
  views: number;
  createdAt: string;
}

const DashboardPage: FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentArticles, setRecentArticles] = useState<RecentArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [articlesRes] = await Promise.all([
          fetch(API.articles.list({ pageSize: 5 })),
        ]);

        const articlesData = await articlesRes.json();

        const articleCount = articlesData.total || 0;
        const totalViews = articlesData.data?.reduce((sum: number, a: RecentArticle) => sum + a.views, 0) || 0;

        setStats({
          articleCount,
          totalViews,
          momentCount: 0,
          totalLikes: 0,
          commentCount: 0,
        });
        setRecentArticles(articlesData.data || []);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>仪表盘</h2>
      
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            {loading ? <Skeleton active /> : (
              <Statistic
                title="文章总数"
                value={stats?.articleCount || 0}
                prefix={<FileTextOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            )}
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            {loading ? <Skeleton active /> : (
              <Statistic
                title="总阅读量"
                value={stats?.totalViews || 0}
                prefix={<EyeOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            )}
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            {loading ? <Skeleton active /> : (
              <Statistic
                title="说说总数"
                value={stats?.momentCount || 0}
                prefix={<HeartOutlined />}
                valueStyle={{ color: '#eb2f96' }}
              />
            )}
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            {loading ? <Skeleton active /> : (
              <Statistic
                title="评论总数"
                value={stats?.commentCount || 0}
                prefix={<CommentOutlined />}
                valueStyle={{ color: '#faad14' }}
              />
            )}
          </Card>
        </Col>
      </Row>

      <Card title="最近文章" style={{ marginTop: 24 }}>
        <List
          loading={loading}
          dataSource={recentArticles}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={item.title}
                description={
                  <span>
                    <Tag>{item.category}</Tag>
                    <span style={{ marginLeft: 8, color: '#999' }}>
                      {item.createdAt}
                    </span>
                  </span>
                }
              />
              <span style={{ color: '#999' }}>
                <EyeOutlined /> {item.views}
              </span>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default DashboardPage;
