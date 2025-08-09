import React, { useState } from 'react';
import { Layout, Typography, Button, Drawer, Grid } from 'antd';
import { HomeOutlined, AppstoreOutlined, UserOutlined, MenuOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;
const { useBreakpoint } = Grid;

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const screens = useBreakpoint();
  const isMobile = !screens.md; // < md
  const [open, setOpen] = useState(false);

  const NavButtons = (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Button
        icon={<HomeOutlined />}
        onClick={() => {
          navigate('/');
          setOpen(false);
        }}
        style={{
          background: 'linear-gradient(45deg, #cba6f7, #89b4fa)',
          border: 'none',
          boxShadow: '0 2px 8px rgba(203, 166, 247, 0.3)',
          color: '#1e1e2e',
        }}
        type="primary"
      >
        Home
      </Button>
      <Button
        icon={<AppstoreOutlined />}
        onClick={() => {
          navigate('/app');
          setOpen(false);
        }}
        style={{
          background: 'linear-gradient(45deg, #cba6f7, #89b4fa)',
          border: 'none',
          boxShadow: '0 2px 8px rgba(203, 166, 247, 0.3)',
          color: '#1e1e2e',
        }}
        type="primary"
      >
        App Demo
      </Button>
    </div>
  );

  return (
    <Layout style={{ minHeight: '100dvh', background: 'transparent', width: '100%' }}>
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 0,
          margin: 0,
          width: '100%',
          lineHeight: 'normal',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
          <Title
            level={3}
            style={{
              color: '#cdd6f4',
              margin: 0,
              marginLeft: isMobile ? 12 : 24,
              background: 'linear-gradient(45deg, #cba6f7, #89b4fa)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              whiteSpace: 'nowrap',
              fontSize: 'clamp(16px, 4vw, 20px)',
            }}
          >
            ✨ Catppuccin App
          </Title>

          {/* Nav buttons: inline on desktop, hidden on mobile */}
          {!isMobile && NavButtons}

          {/* Spacer pushes right controls */}
          <div style={{ flex: 1 }} />

          {/* Right controls */}
          {!isMobile && (
            <Button
              type="primary"
              icon={<UserOutlined />}
              style={{
                background: 'linear-gradient(45deg, #cba6f7, #89b4fa)',
                border: 'none',
                boxShadow: '0 2px 8px rgba(203, 166, 247, 0.3)',
                marginRight: 24,
              }}
            >
              Login
            </Button>
          )}

          {isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 12 }}>
              <Button
                type="primary"
                icon={<UserOutlined />}
                style={{
                  background: 'linear-gradient(45deg, #cba6f7, #89b4fa)',
                  border: 'none',
                  boxShadow: '0 2px 8px rgba(203, 166, 247, 0.3)',
                }}
              >
                Login
              </Button>
              <Button
                aria-label="Open menu"
                icon={<MenuOutlined />}
                onClick={() => setOpen(true)}
              />
            </div>
          )}
        </div>
      </Header>

      <Content style={{ padding: 0, margin: 0, flex: 1, width: '100%' }}>{children}</Content>

      <Footer
        style={{
          textAlign: 'center',
          background: 'linear-gradient(45deg, #181825, #11111b)',
          color: '#bac2de',
          borderTop: '1px solid #313244',
          padding: 0,
          margin: 0,
          width: '100%',
        }}
      >
        ✨ Catppuccin App ©2025 • Created with 💜 and Ant Design
      </Footer>

      {/* Mobile Drawer */}
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        placement="right"
        bodyStyle={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}
      >
        {NavButtons}
        <Button
          icon={<UserOutlined />}
          onClick={() => setOpen(false)}
          type="primary"
          style={{
            background: 'linear-gradient(45deg, #cba6f7, #89b4fa)',
            border: 'none',
            boxShadow: '0 2px 8px rgba(203, 166, 247, 0.3)',
            color: '#1e1e2e',
          }}
        >
          Login
        </Button>
      </Drawer>
    </Layout>
  );
};

export default AppLayout;
