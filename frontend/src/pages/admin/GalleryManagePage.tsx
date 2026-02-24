import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { Table, Button, Space, Modal, Form, Input, Select, message, Popconfirm, Card, Image } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useAuth } from '../../hooks/useAuth';
import { API, fetchApi, fetchWithAuth } from '../../config/api';

interface GalleryImage {
  id: number;
  url: string;
  title: string;
  description?: string;
  category: string;
  createdAt: string;
  tags: string[];
}

const GalleryManagePage: FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const { token } = useAuth();

  const fetchImages = async () => {
    setLoading(true);
    try {
      const data = await fetchApi<GalleryImage[]>(API.gallery.list({ pageSize: 100 }));
      setImages(data || []);
    } catch (error) {
      message.error('获取图片列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleCreate = async (values: Record<string, unknown>) => {
    try {
      await fetchWithAuth(API.gallery.create, token!, {
        method: 'POST',
        body: JSON.stringify({
          ...values,
          tags: typeof values.tags === 'string' 
            ? (values.tags as string).split(',').map((t: string) => t.trim()).filter(Boolean)
            : values.tags,
        }),
      });
      message.success('添加成功');
      setModalVisible(false);
      form.resetFields();
      fetchImages();
    } catch (error) {
      message.error('添加失败');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await fetchWithAuth(API.gallery.delete(id), token!, { method: 'DELETE' });
      message.success('删除成功');
      fetchImages();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const columns: ColumnsType<GalleryImage> = [
    {
      title: '预览',
      dataIndex: 'url',
      width: 100,
      render: (url) => <Image src={url} style={{ width: 60, height: 60, objectFit: 'cover' }} />,
    },
    {
      title: '标题',
      dataIndex: 'title',
      ellipsis: true,
    },
    {
      title: '分类',
      dataIndex: 'category',
      width: 100,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      width: 120,
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      render: (_, record) => (
        <Popconfirm
          title="确定删除吗？"
          onConfirm={() => handleDelete(record.id)}
          okText="确定"
          cancelText="取消"
        >
          <Button type="link" danger icon={<DeleteOutlined />}>
            删除
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <Card>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalVisible(true)}>
          添加图片
        </Button>
      </div>

      <Table columns={columns} dataSource={images} rowKey="id" loading={loading} />

      <Modal
        title="添加图片"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleCreate} layout="vertical" initialValues={{ category: '风景' }}>
          <Form.Item name="url" label="图片URL" rules={[{ required: true, message: '请输入图片URL' }]}>
            <Input placeholder="https://example.com/image.jpg" />
          </Form.Item>
          <Form.Item name="title" label="标题" rules={[{ required: true, message: '请输入标题' }]}>
            <Input placeholder="图片标题" />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input.TextArea rows={2} placeholder="图片描述" />
          </Form.Item>
          <Form.Item name="category" label="分类" rules={[{ required: true }]}>
            <Select
              options={[
                { value: '风景', label: '风景' },
                { value: '城市', label: '城市' },
                { value: '生活', label: '生活' },
                { value: '其他', label: '其他' },
              ]}
            />
          </Form.Item>
          <Form.Item name="tags" label="标签">
            <Input placeholder="多个标签用逗号分隔" />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">添加</Button>
              <Button onClick={() => setModalVisible(false)}>取消</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default GalleryManagePage;
