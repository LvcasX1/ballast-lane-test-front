import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Statistic, Table, Typography, message, Empty, Modal, Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { AnimatedDiv } from '../../../components/Animated';
import type { LibrarianDashboard, OverdueMember, OverdueBookItem } from '../types/dashboard';
import { useGetLibrarianDashboard } from '../useCases/useGetLibrarianDashboard';

const { Title } = Typography;

export const LibrarianDashboardView: React.FC = () => {
  const [data, setData] = useState<LibrarianDashboard | null>(null);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<OverdueMember | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    useGetLibrarianDashboard()
      .then((d) => { if (mounted) setData(d); })
      .catch((e: any) => message.error(e?.message || 'Failed to load dashboard'))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  const columns: ColumnsType<OverdueMember> = [
    { title: 'Member', key: 'member', render: (_, r) => r.member?.name || '-', sorter: (a, b) => (a.member?.name || '').localeCompare(b.member?.name || '') },
    { title: 'Email', key: 'email', render: (_, r) => r.member?.email || '-', sorter: (a, b) => (a.member?.email || '').localeCompare(b.member?.email || '') },
    { title: 'Overdue Books', key: 'overdue_count', align: 'right', render: (_, r) => r.overdue?.length ?? 0, sorter: (a, b) => (a.overdue?.length || 0) - (b.overdue?.length || 0) },
  ];

  const overdueColumns: ColumnsType<OverdueBookItem> = [
    { title: 'Title', dataIndex: 'title', key: 'title', sorter: (a, b) => (a.title || '').localeCompare(b.title || '') },
    { title: 'Due Date', dataIndex: 'due_date', key: 'due_date', render: (v: string) => new Date(v).toLocaleDateString(), sorter: (a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime() },
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
              rowKey={(r) => String(r.book_id)}
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
    </div>
  );
};

export default LibrarianDashboardView;
