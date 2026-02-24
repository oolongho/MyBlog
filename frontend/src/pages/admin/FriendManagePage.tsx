import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { Table, Button, Tag, Space, message, Popconfirm, Card, Select } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useAuth } from '../../hooks/useAuth';
import { API, fetchApi, fetchWithAuth } from '../../config/api';

interface FriendLink {
  id: number;
  name: string;
  avatar: string;
  url: string;
  description: string;
  status: number;
  createdAt: string;
}

const FriendManagePage: FC = () => {
  const [friends, setFriends] = useState<FriendLink[]>([]);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const fetchFriends = async () => {
    setLoading(true);
    try {
      const data = await fetchApi<FriendLink[]>(API.friends.all);
      setFriends(data || []);
    } catch (error) {
      message.error('获取友链列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  const handleStatusChange = async (id: number, status: number) => {
    try {
      await fetchWithAuth(API.friends.status(id), token!, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
      message.success('状态已更新');
      fetchFriends();
    } catch (error) {
      message.error('更新失败');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await fetchWithAuth(API.friends.delete(id), token!, { method: 'DELETE' });
      message.success('删除成功');
      fetchFriends();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const columns: ColumnsType<FriendLink> = [
    {
      title: '头像',
      dataIndex: 'avatar',
      width: 60,
      render: (avatar) => (
        <img src={avatar} alt="" style={{ width: 40, height: 40, borderRadius: '50%' }} />
      ),
    },
    {
      title: '名称',
      dataIndex: 'name',
      width: 100,
    },
    {
      title: '链接',
      dataIndex: 'url',
      ellipsis: true,
      render: (url) => (
        <a href={url} target="_blank" rel="noopener noreferrer">
          {url}
        </a>
      ),
    },
    {
      title: '描述',
      dataIndex: 'description',
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (status) => (
        <Tag color={status === 1 ? 'green' : status === 0 ? 'orange' : 'red'}>
          {status === 1 ? '已通过' : status === 0 ? '待审核' : '已拒绝'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (_, record) => (
        <Space>
          <Select
            size="small"
            value={record.status}
            onChange={(value) => handleStatusChange(record.id, value)}
            style={{ width: 90 }}
            options={[
              { value: 0, label: '待审核' },
              { value: 1, label: '通过' },
              { value: 2, label: '拒绝' },
            ]}
          />
          <Popconfirm
            title="确定删除吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" size="small" danger>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card title="友链管理">
      <Table columns={columns} dataSource={friends} rowKey="id" loading={loading} />
    </Card>
  );
};

export default FriendManagePage;
