import React, { useState } from 'react';
import { Card, Typography, Input, Button, Space, message } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../useCases/useLogin';
import { animated, useSpring } from '@react-spring/web';

const { Title } = Typography;

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [containerStyles, containerApi] = useSpring(() => ({
    from: { opacity: 0, y: 16 },
    to: { opacity: 1, y: 0 },
    config: { tension: 210, friction: 20 },
  }));

  const [pressStyles, pressApi] = useSpring(() => ({ scale: 1 }));

  const onSubmit = async () => {
    setLoading(true);
    try {
      const status = await useLogin(email, password);
      if (status === 200) {
        message.success('Logged in');
        // Play a quick exit animation before navigating to home
        await containerApi.start({ to: { opacity: 0, y: -8 }, config: { duration: 220 } });
        navigate('/');
      } else {
        message.error('Login failed');
      }
    } catch (e: any) {
      message.error(e?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}>
      <animated.div style={{ opacity: containerStyles.opacity, transform: containerStyles.y.to((v) => `translateY(${v}px)`) }}>
        <Card style={{ width: '100%', maxWidth: 420 }}>
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <Title level={3} style={{ textAlign: 'center', margin: 0 }}>Login</Title>
            <Input
              prefix={<UserOutlined />}
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <animated.div
              style={{ transform: pressStyles.scale.to((s) => `scale(${s})`) }}
              onMouseDown={() => pressApi.start({ scale: 0.97 })}
              onMouseUp={() => pressApi.start({ scale: 1 })}
              onMouseLeave={() => pressApi.start({ scale: 1 })}
              onTouchStart={() => pressApi.start({ scale: 0.97 })}
              onTouchEnd={() => pressApi.start({ scale: 1 })}
            >
              <Button type="primary" loading={loading} block onClick={onSubmit}>
                Sign In
              </Button>
            </animated.div>
            <Button type="link" block onClick={() => navigate('/sign-up')}>
              Don’t have an account? Sign up
            </Button>
          </Space>
        </Card>
      </animated.div>
    </div>
  );
};

export default Login;
