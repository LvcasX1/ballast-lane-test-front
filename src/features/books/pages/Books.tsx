import React, { useMemo, useState, useEffect } from 'react';
import { Table, Input, Typography, Space, Card, message, Button, Tag, Dropdown, Empty } from 'antd';
import type { MenuProps } from 'antd';
import { MoreOutlined, PlusOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { Book } from '../types/book';
import { useGetBooks } from '../useCases/useGetBooks';
import { useBorrowBook } from '../useCases/useBorrowBook';
import { isLoggedIn, isLibrarian } from '../../../utils/auth';
import { useCreateBook } from '../useCases/useCreateBook';
import { useUpdateBook } from '../useCases/useUpdateBook';
import { useDeleteBook } from '../useCases/useDeleteBook';
import { BookShowModal } from '../components/BookShowModal';
import { BookCreateModal } from '../components/BookCreateModal';
import { BookDeleteConfirmModal } from '../components/BookDeleteConfirmModal';
import { BookEditModal } from '../components/BookEditModal';
import { AnimatedDiv, Pressable } from '../../../components/Animated';
import { Link } from 'react-router-dom';

const { Title } = Typography;
const { Search } = Input;

const gradientTitleStyle: React.CSSProperties = {
  background: 'linear-gradient(45deg, #cba6f7, #89b4fa)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  margin: 0,
};

const Books: React.FC = () => {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Book | null>(null);
  const [borrowLoading, setBorrowLoading] = useState(false);

  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Book | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Book | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    useGetBooks()
      .then((data) => { if (mounted) setBooks(data); })
      .catch((e) => message.error(e?.message || 'Failed to load books'))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  const columns: ColumnsType<Book> = [
    { title: 'Title', dataIndex: 'title', key: 'title', width: 260, ellipsis: true, sorter: (a, b) => a.title.localeCompare(b.title) },
    { title: 'Author', dataIndex: 'author', key: 'author', width: 200, ellipsis: true, sorter: (a, b) => a.author.localeCompare(b.author) },
    { title: 'Genre', dataIndex: 'genre', key: 'genre', width: 160, ellipsis: true, sorter: (a, b) => a.genre.localeCompare(b.genre) },
    { title: 'ISBN', dataIndex: 'isbn', key: 'isbn', width: 200, ellipsis: true, sorter: (a, b) => a.isbn.localeCompare(b.isbn) },
    { title: 'Total Copies', dataIndex: 'total_copies', key: 'total_copies', width: 140, align: 'right', sorter: (a, b) => a.total_copies - b.total_copies },
    {
      title: 'Remaining Copies',
      key: 'remaining_copies',
      width: 160,
      align: 'right',
      sorter: (a, b) =>
        Math.max(0, (a.total_copies ?? 0) - (a.borrowings_count ?? 0)) -
        Math.max(0, (b.total_copies ?? 0) - (b.borrowings_count ?? 0)),
      render: (_: unknown, r: Book) => Math.max(0, (r.total_copies ?? 0) - (r.borrowings_count ?? 0)),
    },
    {
      title: 'Availability',
      key: 'availability',
      width: 140,
      align: 'center',
      sorter: (a, b) =>
        (a.total_copies - (a.borrowings_count ?? 0)) -
        (b.total_copies - (b.borrowings_count ?? 0)),
      render: (_: unknown, r: Book) => {
        const remaining = Math.max(0, (r.total_copies ?? 0) - (r.borrowings_count ?? 0));
        const color = remaining === 0 ? 'error' : remaining <= 2 ? 'warning' : 'success';
        const text = remaining === 0 ? 'Unavailable' : remaining <= 2 ? 'Low stock' : 'Available';
        return <Tag color={color}>{text}</Tag>;
      },
    },
    ...(isLibrarian()
      ? [{
          title: '',
          key: 'actions',
          fixed: 'right' as const,
          width: 56,
          render: (_: unknown, r: Book) => {
            const items: MenuProps['items'] = [
              { key: 'edit', label: 'Edit', onClick: () => setEditTarget(r) },
              { type: 'divider' as const },
              { key: 'delete', label: <span style={{ color: '#f38ba8' }}>Delete</span>, onClick: () => setDeleteTarget(r) },
            ];
            return (
              <Dropdown menu={{ items }} trigger={["click"]} placement="bottomRight">
                <Button type="text" icon={<MoreOutlined />} />
              </Dropdown>
            );
          },
        }]
      : []),
  ];

  const data = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return books;
    return books.filter((b) =>
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      b.genre.toLowerCase().includes(q) ||
      b.isbn.toLowerCase().includes(q)
    );
  }, [query, books]);

  const handleBorrow = async () => {
    if (!selected) return;
    try {
      setBorrowLoading(true);
      await useBorrowBook(selected.id);
      message.success(`Borrowed "${selected.title}"`);
      setBooks((prev) => prev.map((b) => b.id === selected.id ? { ...b, borrowings_count: (b.borrowings_count ?? 0) + 1 } : b));
      setSelected(null);
    } catch (e: any) {
      message.error(e?.message || 'Failed to borrow book');
    } finally {
      setBorrowLoading(false);
    }
  };

  const [formState, setFormState] = useState<Omit<Book, 'id'>>({ title: '', author: '', genre: '', isbn: '', total_copies: 0, borrowings_count: 0 });

  const resetForm = () => setFormState({ title: '', author: '', genre: '', isbn: '', total_copies: 0, borrowings_count: 0 });

  const handleOpenCreate = () => { resetForm(); setCreateOpen(true); };

  const handleSaveCreate = async () => {
    try {
      setSaving(true);
      const created = await useCreateBook(formState);
      setBooks((prev) => [created as Book, ...prev]);
      message.success('Book created');
      setCreateOpen(false);
    } catch (e: any) {
      message.error(e?.message || 'Failed to create book');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!editTarget) return;
    try {
      setSaving(true);
      const changes = { ...formState };
      const updated = await useUpdateBook({ id: editTarget.id, changes });
      setBooks((prev) => prev.map((b) => (b.id === editTarget.id ? (updated as Book) : b)));
      message.success('Book updated');
      setEditTarget(null);
    } catch (e: any) {
      message.error(e?.message || 'Failed to update book');
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setSaving(true);
      await useDeleteBook(deleteTarget.id);
      setBooks((prev) => prev.filter((b) => b.id !== deleteTarget.id));
      message.success('Book deleted');
      setDeleteTarget(null);
    } catch (e: any) {
      message.error(e?.message || 'Failed to delete book');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section style={{ padding: 24, maxWidth: 1200, margin: '0 auto', width: '100%' }}>
      <Space direction="vertical" size={16} style={{ width: '100%' }}>
        <AnimatedDiv>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <Title level={3} style={gradientTitleStyle}>Books</Title>
            <Space>
              {isLibrarian() && (
                <Pressable>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleOpenCreate}
                    style={{ background: 'linear-gradient(45deg, #cba6f7, #89b4fa)', border: 'none', color: '#1e1e2e' }}
                  >
                    Create Book
                  </Button>
                </Pressable>
              )}
              <Pressable scaleDown={0.98}>
                <Search
                  placeholder="Search by title, author, genre, or ISBN"
                  allowClear
                  onSearch={(v) => setQuery(v)}
                  onChange={(e) => setQuery(e.target.value)}
                  style={{ maxWidth: 360, minWidth: 220 }}
                />
              </Pressable>
            </Space>
          </div>
        </AnimatedDiv>

        {!isLoggedIn() && (
          <AnimatedDiv delay={80}>
            <Typography.Text type="secondary">
              Sign in to borrow books. <Link to="/login">Sign in</Link>
            </Typography.Text>
          </AnimatedDiv>
        )}

        <AnimatedDiv delay={120}>
          <Card bodyStyle={{ padding: 0, overflowX: 'auto' }} style={{ overflowX: 'auto' }}>
            <Table
              rowKey={(r) => r.id}
              columns={columns}
              dataSource={data}
              loading={loading}
              pagination={{ pageSize: 8 }}
              tableLayout="fixed"
              scroll={{ x: 'max-content' }}
              locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No Data" /> }}
              onRow={(record) => ({
                onClick: () => setSelected(record),
                style: { cursor: 'pointer' },
              })}
            />
          </Card>
        </AnimatedDiv>
      </Space>

      {/* Show Modal */}
      <BookShowModal
        open={!!selected}
        book={selected}
        loading={borrowLoading}
        canBorrow={isLoggedIn()}
        onCancel={() => setSelected(null)}
        onBorrow={handleBorrow}
      />

      {/* Create Modal */}
      <BookCreateModal
        open={createOpen}
        loading={saving}
        state={formState}
        onChange={(patch) => setFormState((s) => ({ ...s, ...patch }))}
        onCancel={() => setCreateOpen(false)}
        onOk={handleSaveCreate}
      />

      {/* Edit Modal */}
      <BookEditModal
        open={!!editTarget}
        loading={saving}
        book={editTarget}
        state={formState}
        onChange={(patch) => setFormState((s) => ({ ...s, ...patch }))}
        onCancel={() => setEditTarget(null)}
        onOk={handleSaveEdit}
      />

      {/* Delete Modal */}
      <BookDeleteConfirmModal
        open={!!deleteTarget}
        loading={saving}
        title={deleteTarget?.title}
        onCancel={() => setDeleteTarget(null)}
        onOk={handleConfirmDelete}
      />
    </section>
  );
};

export default Books;
