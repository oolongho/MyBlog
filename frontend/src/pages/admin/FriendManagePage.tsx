import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { Table, Button, Tag, Space, message, Popconfirm, Card, Select, Modal, Form, Input } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useAuth } from '../../hooks/useAuth';
import { API, fetchWithAuth } from '../../config/api';

interface FriendLink {
  id: number;
  name: string;
  avatar: string;
  url: string;
  description: string;
  email?: string;
  status: number;
  createdAt: string;
}

const emojiOptions = ['🌟', '🚀', '💻', '🎨', '📚', '🔥', '⚡', '🎯', '💎', '🌈', '🐱', '🐶', '🌸', '🍀', '☀️', '🌙'];

const FriendManagePage: FC = () => {
  const [friends, setFriends] = useState<FriendLink[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingFriend, setEditingFriend] = useState<FriendLink | null>(null);
  const [form] = Form.useForm();
  const { token } = useAuth();

  const fetchFriends = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await fetchWithAuth<FriendLink[]>(API.friends.all, token);
      setFriends(data || []);
    } catch (error) {
      message.error('获取友链列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchFriends();
    }
  }, [token]);

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

  const handleEdit = async (values: Record<string, unknown>) => {
    if (!editingFriend) return;
    try {
      await fetchWithAuth(API.friends.update(editingFriend.id), token!, {
        method: 'PUT',
        body: JSON.stringify(values),
      });
      message.success('更新成功');
      setModalVisible(false);
      setEditingFriend(null);
      form.resetFields();
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

  const openEditModal = (record: FriendLink) => {
    setEditingFriend(record);
    form.setFieldsValue({
      name: record.name,
      avatar: record.avatar,
      url: record.url,
      description: record.description,
    });
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setEditingFriend(null);
    form.resetFields();
  };

  const columns: ColumnsType<FriendLink> = [
    {
      title: '头像',
      dataIndex: 'avatar',
      width: 60,
      render: (avatar) => {
        if (!avatar) return <span style={{ fontSize: 24 }}>🌟</span>;
        if (avatar.startsWith('http') || avatar.startsWith('/')) {
          return <img src={avatar} alt="" style={{ width: 40, height: 40, borderRadius: '50%' }} />;
        }
        return <span style={{ fontSize: 24 }}>{avatar}</span>;
      },
    },
    {
      title: '名称',
      dataIndex: 'name',
      width: 100,
      ellipsis: true,
    },
    {
      title: '链接',
      dataIndex: 'url',
      width: 150,
      ellipsis: true,
      render: (url) => (
        <a href={url} target="_blank" rel="noopener noreferrer">
          {url}
        </a>
      ),
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      width: 120,
      ellipsis: true,
      render: (email) => email || '-',
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 90,
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
        <Space size="small">
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => openEditModal(record)}>
            编辑
          </Button>
          <Select
            size="small"
            value={record.status}
            onChange={(value) => handleStatusChange(record.id, value)}
            style={{ width: 75 }}
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
      <Table columns={columns} dataSource={friends} rowKey="id" loading={loading} scroll={{ x: 700 }} />

      <Modal
        title="编辑友链"
        open={modalVisible}
        onCancel={handleModalClose}
        footer={null}
      >
        <Form form={form} onFinish={handleEdit} layout="vertical">
          <Form.Item name="name" label="网站名称" rules={[{ required: true, message: '请输入网站名称' }]}>
            <Input placeholder="网站名称" />
          </Form.Item>
          <Form.Item name="url" label="网站地址" rules={[{ required: true, type: 'url', message: '请输入有效的URL' }]}>
            <Input placeholder="https://example.com" />
          </Form.Item>
          <Form.Item name="avatar" label="头像">
            <Input placeholder="输入图片URL或选择emoji" />
          </Form.Item>
          <Form.Item label="选择图标">
            <Form.Item name="avatar" noStyle>
              <input type="hidden" />
            </Form.Item>
            <Form.Item shouldUpdate={(prev, cur) => prev.avatar !== cur.avatar} noStyle>
              {({ getFieldValue, setFieldsValue }) => (
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {emojiOptions.map(emoji => {
                    const currentAvatar = getFieldValue('avatar');
                    const isSelected = currentAvatar === emoji;
                    return (
                      <button
                        key={emoji}
                        type="button"
                        style={{
                          fontSize: 24,
                          cursor: 'pointer',
                          padding: 4,
                          borderRadius: 4,
                          border: 'none',
                          background: isSelected ? 'rgba(0, 204, 102, 0.2)' : 'transparent',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.backgroundColor = 'var(--border-color)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }
                        }}
                        onClick={() => {
                          setFieldsValue({ avatar: emoji });
                        }}
                      >
                        {emoji}
                      </button>
                    );
                  })}
                </div>
              )}
            </Form.Item>
          </Form.Item>
          <Form.Item name="description" label="描述" rules={[{ required: true, message: '请输入描述' }]}>
            <Input.TextArea rows={2} placeholder="网站简介" />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">保存</Button>
              <Button onClick={handleModalClose}>取消</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default FriendManagePage;
