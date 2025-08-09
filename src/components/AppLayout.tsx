import React, { useEffect, useState } from 'react';
import { Layout, Typography, Button, Drawer, Grid, message } from 'antd';
import { HomeOutlined, AppstoreOutlined, MenuOutlined, LogoutOutlined, LoginOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { isLoggedIn, subscribe, logout } from '../utils/auth';
import { useLogout } from '../features/login/useCases/useLogout';

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
  const [authed, setAuthed] = useState(isLoggedIn());

  useEffect(() => {
    setAuthed(isLoggedIn());
    const unsub = subscribe(() => setAuthed(isLoggedIn()));
    return () => unsub();
  }, []);

  const handleLogout = async () => {
    try {
      await useLogout();
      message.success('Logged out');
    } catch (e: any) {
      message.warning(e?.message || 'Server logout failed. Cleared session locally.');
    } finally {
      logout();
      navigate('/');
    }
  };

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

  const drawerLinkStyle: React.CSSProperties = {
    fontSize: 18,
    fontWeight: 700,
    background: 'linear-gradient(45deg, #cba6f7, #89b4fa)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    textDecoration: 'none',
    display: 'block',
    padding: '8px 0',
  };

  const headerControlTextStyle: React.CSSProperties = {
    fontSize: 16,
    fontWeight: 700,
    background: 'linear-gradient(45deg, #cba6f7, #89b4fa)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    textDecoration: 'none',
    cursor: 'pointer',
  };

  const drawerCloseStyle: React.CSSProperties = {
    fontSize: 20,
    fontWeight: 800,
    lineHeight: 1,
    background: 'linear-gradient(45deg, #cba6f7, #89b4fa)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    display: 'inline-block',
  };

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
            onClick={() => { navigate('/'); setOpen(false); }}
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
              cursor: 'pointer',
            }}
          >
            ✨ Cygnvs Library
          </Title>

          {/* Nav buttons: inline on desktop, hidden on mobile */}
          {!isMobile && NavButtons}

          {/* Spacer pushes right controls */}
          <div style={{ flex: 1 }} />

          {/* Right controls */}
          {!isMobile && (
            <Typography.Link
              onClick={() => (authed ? handleLogout() : navigate('/login'))}
              style={{ ...headerControlTextStyle, marginRight: 24 }}
            >
              {authed ? 'Logout' : 'Login'}
            </Typography.Link>
          )}

          {isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 12 }}>
              <Button
                type="primary"
                icon={authed ? <LogoutOutlined /> : <LoginOutlined />}
                onClick={() => (authed ? handleLogout() : navigate('/login'))}
                style={{
                  background: 'linear-gradient(45deg, #cba6f7, #89b4fa)',
                  border: 'none',
                  boxShadow: '0 2px 8px rgba(203, 166, 247, 0.3)',
                }}
              >
                {authed ? 'Logout' : 'Login'}
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
        ✨Cygnvs Library ©2025 • Created by Lvcas
      </Footer>

      {/* Mobile Drawer */}
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        placement="right"
        title={<span style={{ fontWeight: 700, color: '#cdd6f4' }}>Menu</span>}
        styles={{
          header: {
            background: '#11111b',
            borderBottom: '1px solid #313244',
            padding: '12px 16px',
          },
          body: { padding: 16 },
        }}
        closeIcon={<span style={drawerCloseStyle}>×</span>}
      >
        {/* Mobile menu: text-only, one item per row with gradient bold text */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Typography.Link
            onClick={() => {
              navigate('/');
              setOpen(false);
            }}
            style={drawerLinkStyle}
          >
            Home
          </Typography.Link>
          <Typography.Link
            onClick={() => {
              navigate('/app');
              setOpen(false);
            }}
            style={drawerLinkStyle}
          >
            App Demo
          </Typography.Link>
          <Typography.Link
            onClick={() => {
              if (authed) {
                handleLogout();
              } else {
                navigate('/login');
              }
              setOpen(false);
            }}
            style={drawerLinkStyle}
          >
            {authed ? 'Logout' : 'Login'}
          </Typography.Link>
        </div>
      </Drawer>
    </Layout>
  );
};

export default AppLayout;
