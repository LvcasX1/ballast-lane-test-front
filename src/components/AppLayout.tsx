import React, { useEffect, useState } from 'react';
import { Layout, Typography, Button, Drawer, Grid, message } from 'antd';
import { HomeOutlined, MenuOutlined, LogoutOutlined, LoginOutlined, BookOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { isLoggedIn, subscribe, logout } from '../utils/auth';
import { useLogout } from '../features/login/useCases/useLogout';
import { Pressable } from './Animated';

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
      window.location.href = '/';
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
        icon={<BookOutlined />}
        onClick={() => {
          navigate('/books');
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
        Books
      </Button>
      {/* Removed App Demo button from header */}
    </div>
  );

  // Removed old drawerLinkStyle in favor of styled items
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

  const DrawerItem: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void; danger?: boolean }> = ({ icon, label, onClick, danger }) => (
    <Pressable
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 14px',
        borderRadius: 12,
        background: 'rgba(49, 50, 68, 0.6)',
        border: `1px solid ${danger ? 'rgba(243, 139, 168, 0.35)' : 'rgba(203, 166, 247, 0.25)'}`,
        boxShadow: '0 4px 16px rgba(0,0,0,0.25)'
      }}
    >
      <span style={{ color: danger ? '#f38ba8' : '#cba6f7', fontSize: 18, display: 'flex' }}>{icon}</span>
      <span
        style={{
          fontWeight: 700,
          background: danger ? 'linear-gradient(45deg, #f38ba8, #eba0ac)' : 'linear-gradient(45deg, #cba6f7, #89b4fa)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        {label}
      </span>
    </Pressable>
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
            <Button
              type="primary"
              icon={authed ? <LogoutOutlined /> : <LoginOutlined />}
              onClick={() => (authed ? handleLogout() : navigate('/login'))}
              style={{
                background: 'linear-gradient(45deg, #cba6f7, #89b4fa)',
                border: 'none',
                boxShadow: '0 2px 8px rgba(203, 166, 247, 0.3)',
                marginRight: 24,
              }}
            >
              {authed ? 'Logout' : 'Login'}
            </Button>
          )}

          {isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 12 }}>
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
        width={isMobile ? 320 : 360}
        maskStyle={{ backdropFilter: 'blur(2px)', backgroundColor: 'rgba(17,17,27,0.45)' }}
        contentWrapperStyle={{
          boxShadow: '0 8px 32px rgba(0,0,0,0.45)',
          borderLeft: '1px solid #313244',
        }}
        styles={{
          header: {
            background: 'linear-gradient(180deg, #11111b, #181825)',
            borderBottom: '1px solid #313244',
            padding: '12px 16px',
          },
          body: { padding: 16, background: 'linear-gradient(180deg, rgba(17,17,27,0.98), rgba(24,24,37,0.98))' },
        }}
        closeIcon={<span style={drawerCloseStyle}>×</span>}
      >
        {/* Mobile menu: gradient, iconed, pressable items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <DrawerItem
            icon={<HomeOutlined />}
            label="Home"
            onClick={() => {
              navigate('/');
              setOpen(false);
            }}
          />
          <DrawerItem
            icon={<BookOutlined />}
            label="Books"
            onClick={() => {
              navigate('/books');
              setOpen(false);
            }}
          />
          <DrawerItem
            icon={authed ? <LogoutOutlined /> : <LoginOutlined />}
            label={authed ? 'Logout' : 'Login'}
            danger={authed}
            onClick={() => {
              if (authed) {
                handleLogout();
              } else {
                navigate('/login');
              }
              setOpen(false);
            }}
          />
        </div>
      </Drawer>
    </Layout>
  );
};

export default AppLayout;
