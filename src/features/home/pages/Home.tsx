import React from 'react';
import { Typography, Button, Space, Row, Col, Card } from 'antd';
import { isLibrarian, isLoggedIn } from '../../../utils/auth';
import LibrarianDashboardView from '../components/LibrarianDashboard';
import MemberDashboardView from '../components/MemberDashboard';
import { Link } from 'react-router-dom';
import { AnimatedDiv, Pressable } from '../../../components/Animated';
import { BookOutlined, ThunderboltOutlined, SafetyOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const Home: React.FC = () => {
  const loggedIn = isLoggedIn();
  const librarian = loggedIn && isLibrarian();

  return (
    <section
      style={{
        width: '100%',
        minHeight: 'calc(100dvh - 64px - 70px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexDirection: 'column',
        textAlign: 'center',
        padding: '24px',
        background: 'radial-gradient(1200px 600px at 50% -10%, rgba(203, 166, 247, 0.15), transparent), radial-gradient(800px 400px at 90% 20%, rgba(137, 180, 250, 0.12), transparent), radial-gradient(600px 300px at 10% 70%, rgba(166, 227, 161, 0.10), transparent)'
      }}
    >
      <Title
        level={1}
        style={{
          background: 'linear-gradient(45deg, #cba6f7, #f5c2e7, #89b4fa)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: 0,
        }}
      >
        Welcome to Cygnvs Library
      </Title>

      {!loggedIn ? (
        <>
          <AnimatedDiv delay={60}>
            <Paragraph style={{ color: '#bac2de', marginTop: 12, fontSize: 16 }}>
              Discover, borrow, and track your favorite books. Join now to get started.
            </Paragraph>
          </AnimatedDiv>

          <AnimatedDiv delay={120}>
            <Space size="middle" wrap style={{ marginTop: 8 }}>
              <Pressable>
                <Link to="/sign-up">
                  <Button type="primary" size="large" style={{ minWidth: 140 }}>
                    Get Started
                  </Button>
                </Link>
              </Pressable>
              <Pressable>
                <Link to="/books">
                  <Button
                    size="large"
                    style={{ minWidth: 150, backgroundColor: 'transparent', borderColor: '#cba6f7', color: '#cba6f7' }}
                  >
                    Browse Books
                  </Button>
                </Link>
              </Pressable>
            </Space>
          </AnimatedDiv>

          <AnimatedDiv delay={180} style={{ width: '100%', maxWidth: 1100, marginTop: 28 }}>
            <Row gutter={[16, 16]} justify="center">
              <Col xs={24} sm={12} md={8}>
                <Card bordered style={{ height: '100%' }}>
                  <Space direction="vertical" size={6} align="center" style={{ width: '100%' }}>
                    <BookOutlined style={{ fontSize: 28, color: '#cba6f7' }} />
                    <Title level={4} style={{ margin: 0 }}>Curated Collection</Title>
                    <Paragraph style={{ color: '#bac2de', margin: 0 }}>Explore a growing catalog across genres.</Paragraph>
                  </Space>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Card bordered style={{ height: '100%' }}>
                  <Space direction="vertical" size={6} align="center" style={{ width: '100%' }}>
                    <ThunderboltOutlined style={{ fontSize: 28, color: '#89b4fa' }} />
                    <Title level={4} style={{ margin: 0 }}>Fast Search</Title>
                    <Paragraph style={{ color: '#bac2de', margin: 0 }}>Find books instantly by title, author, or genre.</Paragraph>
                  </Space>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Card bordered style={{ height: '100%' }}>
                  <Space direction="vertical" size={6} align="center" style={{ width: '100%' }}>
                    <SafetyOutlined style={{ fontSize: 28, color: '#a6e3a1' }} />
                    <Title level={4} style={{ margin: 0 }}>Track Borrowings</Title>
                    <Paragraph style={{ color: '#bac2de', margin: 0 }}>Stay on top of due dates and returns with ease.</Paragraph>
                  </Space>
                </Card>
              </Col>
            </Row>
          </AnimatedDiv>
        </>
      ) : (
        <>
          <Paragraph style={{ color: '#bac2de', marginTop: 8 }}>
            Discover, borrow, and track your favorite books.
          </Paragraph>
          <div style={{ width: '100%', maxWidth: 1200, marginTop: 24 }}>
            {librarian ? <LibrarianDashboardView /> : <MemberDashboardView />}
          </div>
        </>
      )}
    </section>
  );
};

export default Home;
