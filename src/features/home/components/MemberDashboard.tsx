import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Statistic, Table, Typography, Tag, message, Empty, Modal, Button, Descriptions } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { AnimatedDiv } from '../../../components/Animated';
import type { MemberBorrowing, MemberBorrowRecord, MemberDashboard } from '../types/dashboard';
import { useGetMemberDashboard } from '../useCases/useGetMemberDashboard';

const { Title } = Typography;

export const MemberDashboardView: React.FC = () => {
  const [data, setData] = useState<MemberDashboard | null>(null);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<MemberBorrowRecord | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    useGetMemberDashboard()
      .then((d) => { if (mounted) setData(d); })
      .catch((e: any) => message.error(e?.message || 'Failed to load dashboard'))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  const oldColumns: ColumnsType<MemberBorrowing> = [
    { title: 'Title', dataIndex: 'title', key: 'title', sorter: (a, b) => (a.title || '').localeCompare(b.title || '') },
    { title: 'Due Date', dataIndex: 'due_date', key: 'due_date', render: (v: string) => new Date(v).toLocaleDateString(), sorter: (a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime() },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (s: MemberBorrowing['status']) => {
      const color = s === 'overdue' ? 'error' : s === 'borrowed' ? 'warning' : 'success';
      const text = s.charAt(0).toUpperCase() + s.slice(1);
      return <Tag color={color}>{text}</Tag>;
    }, sorter: (a, b) => (a.status || '').localeCompare(b.status || '') },
  ];

  const cols: ColumnsType<MemberBorrowRecord> = [
    { title: 'Title', key: 'title', render: (_, r) => r.book?.title || '-', sorter: (a, b) => (a.book?.title || '').localeCompare(b.book?.title || '') },
    { title: 'Author', key: 'author', render: (_, r) => r.book?.author || '-', sorter: (a, b) => (a.book?.author || '').localeCompare(b.book?.author || '') },
    { title: 'Borrowed At', dataIndex: 'borrowed_at', key: 'borrowed_at', render: (v: string) => new Date(v).toLocaleDateString(), sorter: (a, b) => new Date(a.borrowed_at).getTime() - new Date(b.borrowed_at).getTime() },
    { title: 'Due Date', dataIndex: 'due_date', key: 'due_date', render: (v: string) => new Date(v).toLocaleDateString(), sorter: (a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime() },
    { title: 'Status', key: 'status', render: (_, r) => {
      const isOverdue = !r.returned_at && new Date(r.due_date).getTime() < Date.now();
      const color = isOverdue ? 'error' : 'warning';
      const text = isOverdue ? 'Overdue' : 'Borrowed';
      return <Tag color={color}>{text}</Tag>;
    }, sorter: (a, b) => {
      const aOverdue = !a.returned_at && new Date(a.due_date).getTime() < Date.now();
      const bOverdue = !b.returned_at && new Date(b.due_date).getTime() < Date.now();
      return Number(aOverdue) - Number(bOverdue);
    } },
  ];

  const hasNewShape = !!(data?.active || data?.overdue);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <AnimatedDiv>
        <Title level={3} style={{ margin: 0 }}>Dashboard</Title>
      </AnimatedDiv>

      <AnimatedDiv>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
            <Card>
              <Statistic title="Borrowed" value={data?.my_borrowed_count ?? (data?.active?.length ?? 0)} loading={loading} />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card>
              <Statistic title="Overdue" value={data?.my_overdue_count ?? (data?.overdue?.length ?? 0)} loading={loading} />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card>
              <Statistic title="Due Today" value={data?.my_due_today_count ?? 0} loading={loading} />
            </Card>
          </Col>
        </Row>
      </AnimatedDiv>

      <AnimatedDiv>
        {hasNewShape ? (
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Card title="Active Borrowings">
                <Table
                  rowKey={(r) => String(r.id)}
                  columns={cols}
                  dataSource={data?.active || []}
                  loading={loading}
                  pagination={{ pageSize: 5 }}
                  locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No Data" /> }}
                  onRow={(record) => ({ onClick: () => setSelected(record), style: { cursor: 'pointer' } })}
                  scroll={{ x: 'max-content' }}
                />
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card title="Overdue Borrowings">
                <Table
                  rowKey={(r) => String(r.id)}
                  columns={cols}
                  dataSource={data?.overdue || []}
                  loading={loading}
                  pagination={{ pageSize: 5 }}
                  locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No Data" /> }}
                  onRow={(record) => ({ onClick: () => setSelected(record), style: { cursor: 'pointer' } })}
                  scroll={{ x: 'max-content' }}
                />
              </Card>
            </Col>
          </Row>
        ) : (
          <Card title="My Borrowings">
            <Table
              rowKey={(r) => r.id}
              columns={oldColumns}
              dataSource={data?.my_borrowings || []}
              loading={loading}
              pagination={{ pageSize: 5 }}
              locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No Data" /> }}
              scroll={{ x: 'max-content' }}
            />
          </Card>
        )}
      </AnimatedDiv>

      <Modal
        open={!!selected}
        onCancel={() => setSelected(null)}
        title={selected ? selected.book?.title : 'Borrowing'}
        footer={[<Button key="close" onClick={() => setSelected(null)}>Close</Button>]}
      >
        {selected && (
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Title">{selected.book?.title}</Descriptions.Item>
            <Descriptions.Item label="Author">{selected.book?.author}</Descriptions.Item>
            <Descriptions.Item label="Borrowed At">{new Date(selected.borrowed_at).toLocaleString()}</Descriptions.Item>
            <Descriptions.Item label="Due Date">{new Date(selected.due_date).toLocaleString()}</Descriptions.Item>
            <Descriptions.Item label="Status">
              {!selected.returned_at && new Date(selected.due_date).getTime() < Date.now() ? (
                <Tag color="error">Overdue</Tag>
              ) : (
                <Tag color="warning">Borrowed</Tag>
              )}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default MemberDashboardView;
