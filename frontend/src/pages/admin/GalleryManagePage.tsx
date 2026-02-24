import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { Table, Button, Space, Modal, Form, Input, message, Popconfirm, Card, Image, AutoComplete } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useAuth } from '../../hooks/useAuth';
import { API, fetchApi, fetchWithAuth } from '../../config/api';
import { formatDate } from '../../utils/date';

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
  const [categories, setCategories] = useState<string[]>(['风景', '城市', '生活', '其他']);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [form] = Form.useForm();
  const { token } = useAuth();

  const fetchImages = async () => {
    setLoading(true);
    try {
      const data = await fetchApi<GalleryImage[]>(API.gallery.list({ pageSize: 50 }));
      setImages(data || []);
      
      const uniqueCategories = new Set<string>();
      (data || []).forEach((img: GalleryImage) => {
        if (img.category) uniqueCategories.add(img.category);
      });
      if (uniqueCategories.size > 0) {
        setCategories(['风景', '城市', '生活', '其他', ...Array.from(uniqueCategories).filter(c => !['风景', '城市', '生活', '其他'].includes(c))]);
      }
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

  const handleEdit = async (values: Record<string, unknown>) => {
    if (!editingImage) return;
    try {
      await fetchWithAuth(API.gallery.update(editingImage.id), token!, {
        method: 'PUT',
        body: JSON.stringify({
          ...values,
          tags: typeof values.tags === 'string' 
            ? (values.tags as string).split(',').map((t: string) => t.trim()).filter(Boolean)
            : values.tags,
        }),
      });
      message.success('更新成功');
      setModalVisible(false);
      setEditingImage(null);
      form.resetFields();
      fetchImages();
    } catch (error) {
      message.error('更新失败');
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

  const openEditModal = (record: GalleryImage) => {
    setEditingImage(record);
    form.setFieldsValue({
      url: record.url,
      title: record.title,
      description: record.description,
      category: record.category,
      tags: Array.isArray(record.tags) ? record.tags.join(', ') : record.tags,
    });
    setModalVisible(true);
  };

  const openCreateModal = () => {
    setEditingImage(null);
    form.resetFields();
    form.setFieldsValue({ category: '风景' });
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setEditingImage(null);
    form.resetFields();
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
          添加图片
        </Button>
      </div>

      <Table columns={columns} dataSource={images} rowKey="id" loading={loading} />

      <Modal
        title={editingImage ? '编辑图片' : '添加图片'}
        open={modalVisible}
        onCancel={handleModalClose}
        footer={null}
      >
        <Form 
          form={form} 
          onFinish={editingImage ? handleEdit : handleCreate} 
          layout="vertical"
        >
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
            <AutoComplete
              options={categories.map(c => ({ value: c }))}
              placeholder="选择或输入分类"
              filterOption={(inputValue, option) =>
                option!.value.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1
              }
            />
          </Form.Item>
          <Form.Item name="tags" label="标签">
            <Input placeholder="多个标签用逗号分隔" />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">{editingImage ? '更新' : '添加'}</Button>
              <Button onClick={handleModalClose}>取消</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default GalleryManagePage;
