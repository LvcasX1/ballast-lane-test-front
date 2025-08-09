import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Statistic, Table, Typography, message, Empty, Modal, Button, Popconfirm, Space, Descriptions } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { AnimatedDiv } from '../../../components/Animated';
import type { LibrarianDashboard, OverdueMember, OverdueBookItem, ActiveBorrowingItem } from '../types/dashboard';
import { useGetLibrarianDashboard, useGetCurrentBorrowings } from '../useCases/useGetLibrarianDashboard';
import { useReturnBorrowing } from '../useCases/useReturnBorrowing';

const { Title } = Typography;

// Helper to derive a borrowing id from various shapes
function getBorrowingIdFromAny(item: any): string | number | undefined {
  return item?.borrowing_id ?? item?.id ?? item?.book_id;
}

export const LibrarianDashboardView: React.FC = () => {
  const [data, setData] = useState<LibrarianDashboard | null>(null);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<OverdueMember | null>(null);
  const [current, setCurrent] = useState<ActiveBorrowingItem[]>([]);
  const [currentLoading, setCurrentLoading] = useState(false);
  const [returningId, setReturningId] = useState<string | number | null>(null);
  const [currentSelected, setCurrentSelected] = useState<ActiveBorrowingItem | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const d = await useGetLibrarianDashboard();
      setData(d);
    } catch (e: any) {
      message.error(e?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const loadCurrent = async () => {
    setCurrentLoading(true);
    try {
      const list = await useGetCurrentBorrowings();
      setCurrent(list as ActiveBorrowingItem[]);
    } catch (e: any) {
      message.error(e?.message || 'Failed to load current borrowings');
    } finally {
      setCurrentLoading(false);
    }
  };

  useEffect(() => {
    (async () => { await load(); await loadCurrent(); })();
  }, []);

  const handleReturn = async (borrowingId: string | number) => {
    try {
      setReturningId(borrowingId);
      await useReturnBorrowing(borrowingId);
      message.success('Marked as returned');
      await Promise.all([load(), loadCurrent()]);
    } catch (e: any) {
      message.error(e?.message || 'Failed to mark as returned');
    } finally {
      setReturningId(null);
    }
  };

  const columns: ColumnsType<OverdueMember> = [
    { title: 'Member', key: 'member', render: (_, r) => r.member?.name || '-', sorter: (a, b) => (a.member?.name || '').localeCompare(b.member?.name || '') },
    { title: 'Email', key: 'email', render: (_, r) => r.member?.email || '-', sorter: (a, b) => (a.member?.email || '').localeCompare(b.member?.email || '') },
    { title: 'Overdue Books', key: 'overdue_count', align: 'right', render: (_, r) => r.overdue?.length ?? 0, sorter: (a, b) => (a.overdue?.length || 0) - (b.overdue?.length || 0) },
  ];

  const overdueColumns: ColumnsType<OverdueBookItem> = [
    { title: 'Title', dataIndex: 'title', key: 'title', sorter: (a, b) => (a.title || '').localeCompare(b.title || '') },
    { title: 'Due Date', dataIndex: 'due_date', key: 'due_date', render: (v: string) => new Date(v).toLocaleDateString(), sorter: (a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime() },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, item) => {
        const borrowingId = (item as any).borrowing_id as string | number | undefined;
        return (
          <Space>
            <Popconfirm
              title="Mark as returned?"
              okText="Yes"
              cancelText="No"
              onConfirm={() => borrowingId && handleReturn(borrowingId)}
              disabled={!borrowingId}
            >
              <Button type="primary" disabled={!borrowingId} loading={borrowingId ? returningId === borrowingId : false}>
                Return
              </Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  const currentColumns: ColumnsType<ActiveBorrowingItem> = [
    { title: 'Borrowing ID', dataIndex: 'id', key: 'id', sorter: (a, b) => Number(a.id) - Number(b.id) },
    { title: 'Book', dataIndex: 'book_title', key: 'book_title', sorter: (a, b) => (a.book_title || '').localeCompare(b.book_title || '') },
    { title: 'Member', dataIndex: 'user_name', key: 'user_name', sorter: (a, b) => (a.user_name || '').localeCompare(b.user_name || '') },
    { title: 'Borrowed At', dataIndex: 'borrowed_at', key: 'borrowed_at', render: (v: string) => new Date(v).toLocaleDateString(), sorter: (a, b) => new Date(a.borrowed_at).getTime() - new Date(b.borrowed_at).getTime() },
    { title: 'Due Date', dataIndex: 'due_date', key: 'due_date', render: (v: string) => new Date(v).toLocaleDateString(), sorter: (a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime() },
    {
      title: 'Actions', key: 'actions', render: (_, r) => (
        <Space>
          <Button onClick={() => setCurrentSelected(r)}>Details</Button>
          <Popconfirm title="Mark as returned?" okText="Yes" cancelText="No" onConfirm={() => handleReturn(r.id)}>
            <Button type="primary" loading={returningId === r.id}>Return</Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <AnimatedDiv>
        <Title level={3} style={{ margin: 0 }}>Dashboard</Title>
      </AnimatedDiv>

      <AnimatedDiv>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
            <Card>
              <Statistic title="Total Books" value={data?.total_books ?? 0} loading={loading} />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card>
              <Statistic title="Total Borrowed" value={data?.total_borrowed_books ?? 0} loading={loading} />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card>
              <Statistic title="Due Today" value={data?.books_due_today ?? 0} loading={loading} />
            </Card>
          </Col>
        </Row>
      </AnimatedDiv>

      <AnimatedDiv>
        <Card title="Members with Overdue Books">
          <Table
            rowKey={(r) => String(r.member?.id ?? Math.random())}
            columns={columns}
            dataSource={data?.overdue_members || []}
            loading={loading}
            pagination={{ pageSize: 5 }}
            locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No Data" /> }}
            onRow={(record) => ({
              onClick: () => setSelected(record),
              style: { cursor: 'pointer' },
            })}
            scroll={{ x: 'max-content' }}
          />
        </Card>
      </AnimatedDiv>

      <Modal
        open={!!selected}
        onCancel={() => setSelected(null)}
        title={selected ? `Overdue for ${selected.member?.name}` : 'Overdue'}
        footer={[<Button key="close" onClick={() => setSelected(null)}>Close</Button>]}
      >
        {selected && (
          <>
            <Typography.Paragraph style={{ marginBottom: 8 }} type="secondary">
              {selected.member?.email}
            </Typography.Paragraph>
            <Table
              rowKey={(r) => String(getBorrowingIdFromAny(r) ?? Math.random())}
              columns={overdueColumns}
              dataSource={selected.overdue || []}
              pagination={false}
              size="small"
              locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No Data" /> }}
              scroll={{ x: 'max-content' }}
            />
          </>
        )}
      </Modal>

      <AnimatedDiv>
        <Card title="Current Borrowed Books">
          <Table
            rowKey={(r) => String(r.id)}
            columns={currentColumns}
            dataSource={current}
            loading={currentLoading}
            pagination={{ pageSize: 5 }}
            locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No Data" /> }}
            scroll={{ x: 'max-content' }}
          />
        </Card>
      </AnimatedDiv>

      <Modal
        open={!!currentSelected}
        onCancel={() => setCurrentSelected(null)}
        title={currentSelected ? `Borrowing • ${currentSelected.book_title}` : 'Borrowing'}
        footer={[
          <Button key="close" onClick={() => setCurrentSelected(null)}>Close</Button>,
          <Popconfirm key="return" title="Mark as returned?" okText="Yes" cancelText="No" onConfirm={() => currentSelected && handleReturn(currentSelected.id)}>
            <Button type="primary" loading={returningId === (currentSelected?.id ?? null)}>Return</Button>
          </Popconfirm>
        ]}
      >
        {currentSelected && (
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Borrowing ID">{currentSelected.id}</Descriptions.Item>
            <Descriptions.Item label="Member">{currentSelected.user_name}</Descriptions.Item>
            <Descriptions.Item label="Book">{currentSelected.book_title}</Descriptions.Item>
            <Descriptions.Item label="Borrowed At">{new Date(currentSelected.borrowed_at).toLocaleString()}</Descriptions.Item>
            <Descriptions.Item label="Due Date">{new Date(currentSelected.due_date).toLocaleString()}</Descriptions.Item>
            <Descriptions.Item label="Status"><span style={{ color: '#e5c890' }}>Borrowed</span></Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default LibrarianDashboardView;
