import React from 'react';
import { Typography } from 'antd';

const { Title, Paragraph } = Typography;

const Home: React.FC = () => {
  return (
    <section
      style={{
        width: '100%',
        minHeight: 'calc(100dvh - 64px - 70px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        textAlign: 'center',
        padding: '24px',
        background: 'radial-gradient(1200px 600px at 50% -10%, rgba(203, 166, 247, 0.15), transparent), radial-gradient(800px 400px at 90% 20%, rgba(137, 180, 250, 0.12), transparent), radial-gradient(600px 300px at 10% 70%, rgba(166, 227, 161, 0.10), transparent)'
      }}
    >
      <div style={{ fontSize: '48px', marginBottom: '12px' }}>🌸</div>
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
        Welcome to Catppuccin App
      </Title>
      <Paragraph style={{ color: '#bac2de', marginTop: 8 }}>
        A soothing pastel theme for your React + Ant Design app.
      </Paragraph>
    </section>
  );
};

export default Home;
