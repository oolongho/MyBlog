import type { FC } from 'react';
import { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  message,
  Popconfirm,
  Card,
  Image,
} from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useAuth } from '../../hooks/useAuth';
import { API, fetchApi, fetchWithAuth } from '../../config/api';
import { formatDate } from '../../utils/date';

interface MomentItem {
  id: number;
  content: string;
  images: string[] | string;
  likes: number;
  createdAt: string;
}

const MomentManagePage: FC = () => {
  const [moments, setMoments] = useState<MomentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingMoment, setEditingMoment] = useState<MomentItem | null>(null);
  const [form] = Form.useForm();
  const { token } = useAuth();

  const fetchMoments = async () => {
    setLoading(true);
    try {
      const data = await fetchApi<MomentItem[]>(API.moments.list({ pageSize: 50 }));
      setMoments(Array.isArray(data) ? data : []);
    } catch (error) {
      message.error('获取说说列表失败');
      setMoments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (values: { content: string; images: string }) => {
    try {
      const imageUrls = values.images
        ? values.images
            .split('\n')
            .map((url: string) => url.trim())
            .filter(Boolean)
        : [];

      await fetchWithAuth(API.moments.create, token!, {
        method: 'POST',
        body: JSON.stringify({ content: values.content, images: imageUrls }),
      });
      message.success('创建成功');
      setModalVisible(false);
      form.resetFields();
      fetchMoments();
    } catch (error) {
      message.error('创建失败');
    }
  };

  const handleEdit = async (values: { content: string; images: string }) => {
    if (!editingMoment) return;
    
    try {
      const imageUrls = values.images
        ? values.images
            .split('\n')
            .map((url: string) => url.trim())
            .filter(Boolean)
        : [];

      await fetchWithAuth(API.moments.update(editingMoment.id), token!, {
        method: 'PUT',
        body: JSON.stringify({ content: values.content, images: imageUrls }),
      });
      message.success('更新成功');
      setModalVisible(false);
      setEditingMoment(null);
      form.resetFields();
      fetchMoments();
    } catch (error) {
      message.error('更新失败');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await fetchWithAuth(API.moments.delete(id), token!, { method: 'DELETE' });
      message.success('删除成功');
      fetchMoments();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const openEditModal = (record: MomentItem) => {
    setEditingMoment(record);
    const imgList = parseImages(record.images);
    form.setFieldsValue({
      content: record.content,
      images: imgList.join('\n'),
    });
    setModalVisible(true);
  };

  const openCreateModal = () => {
    setEditingMoment(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setEditingMoment(null);
    form.resetFields();
  };

  useEffect(() => {
    fetchMoments();
  }, []);

  const parseImages = (images: string[] | string): string[] => {
    if (Array.isArray(images)) {
      return images;
    }
    try {
      const parsed = JSON.parse(images || '[]');
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const columns: ColumnsType<MomentItem> = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 60,
    },
    {
      title: '内容',
      dataIndex: 'content',
      ellipsis: true,
    },
    {
      title: '图片',
      dataIndex: 'images',
      width: 120,
      render: (images: string) => {
        const imgList = parseImages(images);
        return imgList.length > 0 ? (
          <Image src={imgList[0]} style={{ width: 60, height: 60, objectFit: 'cover' }} />
        ) : (
          <span style={{ color: '#999' }}>无图片</span>
        );
      },
    },
    {
      title: '点赞数',
      dataIndex: 'likes',
      width: 80,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      width: 140,
      render: (date: string) => formatDate(date),
    },
    {
      title: '操作',
      key: 'action',
      width: 140,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => openEditModal(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确定删除吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger size="small" icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
          发布说说
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={moments}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingMoment ? '编辑说说' : '发布说说'}
        open={modalVisible}
        onCancel={handleModalClose}
        footer={null}
      >
        <Form form={form} onFinish={editingMoment ? handleEdit : handleCreate} layout="vertical">
          <Form.Item
            name="content"
            label="内容"
            rules={[{ required: true, message: '请输入内容' }]}
          >
            <Input.TextArea rows={4} placeholder="说点什么..." />
          </Form.Item>

          <Form.Item name="images" label="图片链接" extra="每行一个图片URL">
            <Input.TextArea
              rows={3}
              placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingMoment ? '更新' : '发布'}
              </Button>
              <Button onClick={handleModalClose}>取消</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default MomentManagePage;
