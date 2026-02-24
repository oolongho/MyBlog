import type { FC } from 'react';
import { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Space,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  AutoComplete,
  message,
  Popconfirm,
  Card,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useAuth } from '../../hooks/useAuth';
import { API, fetchApi, fetchWithAuth } from '../../config/api';

interface Article {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  views: number;
  status: number;
  createdAt: string;
  tags: string[];
}

const ArticleManagePage: FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<string[]>(['技术', '生活', '随笔', '教程']);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [form] = Form.useForm();
  const { token } = useAuth();

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const data = await fetchApi<{ data: Article[] }>(API.articles.list({ pageSize: 100 }));
      setArticles(data.data || []);
      
      const uniqueCategories = new Set<string>();
      (data.data || []).forEach((a: Article) => {
        if (a.category) uniqueCategories.add(a.category);
      });
      if (uniqueCategories.size > 0) {
        setCategories(['技术', '生活', '随笔', '教程', ...Array.from(uniqueCategories).filter(c => !['技术', '生活', '随笔', '教程'].includes(c))]);
      }
    } catch (error) {
      message.error('获取文章列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleCreate = () => {
    setEditingArticle(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: Article) => {
    setEditingArticle(record);
    form.setFieldsValue({
      ...record,
      tags: record.tags?.join(', '),
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await fetchWithAuth(API.articles.delete(id), token!, { method: 'DELETE' });
      message.success('删除成功');
      fetchArticles();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleSubmit = async (values: Record<string, unknown>) => {
    try {
      const articleData = {
        ...values,
        tags: typeof values.tags === 'string'
          ? (values.tags as string).split(',').map(t => t.trim()).filter(Boolean)
          : values.tags,
      };

      if (editingArticle) {
        await fetchWithAuth(API.articles.update(editingArticle.id), token!, {
          method: 'PUT',
          body: JSON.stringify(articleData),
        });
        message.success('更新成功');
      } else {
        await fetchWithAuth(API.articles.create, token!, {
          method: 'POST',
          body: JSON.stringify(articleData),
        });
        message.success('创建成功');
      }
      setModalVisible(false);
      fetchArticles();
    } catch (error) {
      message.error(editingArticle ? '更新失败' : '创建失败');
    }
  };

  const columns: ColumnsType<Article> = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      width: 100,
      render: (category) => <Tag color="blue">{category}</Tag>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status) => (
        <Tag color={status === 1 ? 'green' : 'orange'}>
          {status === 1 ? '已发布' : '草稿'}
        </Tag>
      ),
    },
    {
      title: '阅读量',
      dataIndex: 'views',
      key: 'views',
      width: 80,
      render: (views) => (
        <span>
          <EyeOutlined /> {views}
        </span>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这篇文章吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card
        title="文章管理"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            新建文章
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={articles}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={editingArticle ? '编辑文章' : '新建文章'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ status: 0, category: '技术' }}
        >
          <Form.Item
            name="title"
            label="标题"
            rules={[{ required: true, message: '请输入标题' }]}
          >
            <Input placeholder="请输入文章标题" />
          </Form.Item>

          <Form.Item
            name="excerpt"
            label="摘要"
            rules={[{ required: true, message: '请输入摘要' }]}
          >
            <Input.TextArea rows={2} placeholder="请输入文章摘要" />
          </Form.Item>

          <Form.Item
            name="content"
            label="内容"
            rules={[{ required: true, message: '请输入内容' }]}
          >
            <Input.TextArea rows={10} placeholder="请输入文章内容（支持 Markdown）" />
          </Form.Item>

          <Form.Item
            name="category"
            label="分类"
            rules={[{ required: true, message: '请选择或输入分类' }]}
          >
            <AutoComplete
              options={categories.map(c => ({ value: c }))}
              placeholder="选择或输入分类"
              filterOption={(inputValue, option) =>
                option!.value.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1
              }
            />
          </Form.Item>

          <Form.Item name="tags" label="标签">
            <Input placeholder="多个标签用逗号分隔，如：React, TypeScript" />
          </Form.Item>

          <Form.Item name="status" label="状态">
            <Select
              options={[
                { value: 0, label: '草稿' },
                { value: 1, label: '发布' },
              ]}
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingArticle ? '更新' : '创建'}
              </Button>
              <Button onClick={() => setModalVisible(false)}>取消</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ArticleManagePage;
