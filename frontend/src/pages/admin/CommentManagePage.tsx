import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { Table, Button, message, Popconfirm, Card, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useAuth } from '../../hooks/useAuth';
import { API, fetchApi, fetchWithAuth } from '../../config/api';
import { formatDate } from '../../utils/date';

interface Comment {
  id: number;
  content: string;
  createdAt: string;
  visitor: {
    id: number;
    nickname: string;
    avatar?: string;
  };
  article?: { id: number; title: string };
  moment?: { id: number };
}

const CommentManagePage: FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const fetchComments = async () => {
    setLoading(true);
    try {
      const data = await fetchApi<Comment[]>(API.comments.list({ pageSize: 50 }));
      setComments(data || []);
    } catch (error) {
      message.error('获取评论列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await fetchWithAuth(API.comments.delete(id), token!, { method: 'DELETE' });
      message.success('删除成功');
      fetchComments();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const columns: ColumnsType<Comment> = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 60,
    },
    {
      title: '评论者',
      dataIndex: ['visitor', 'nickname'],
      width: 100,
    },
    {
      title: '内容',
      dataIndex: 'content',
      ellipsis: true,
    },
    {
      title: '来源',
      key: 'source',
      width: 150,
      render: (_, record) =>
        record.article ? (
          <Tag color="blue">文章: {record.article.title}</Tag>
        ) : record.moment ? (
          <Tag color="green">说说</Tag>
        ) : (
          <Tag>未知</Tag>
        ),
    },
    {
      title: '时间',
      dataIndex: 'createdAt',
      width: 140,
      render: (date: string) => formatDate(date),
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Popconfirm
          title="确定删除吗？"
          onConfirm={() => handleDelete(record.id)}
          okText="确定"
          cancelText="取消"
        >
          <Button type="link" danger size="small">
            删除
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <Card title="评论管理">
      <Table columns={columns} dataSource={comments} rowKey="id" loading={loading} />
    </Card>
  );
};

export default CommentManagePage;
