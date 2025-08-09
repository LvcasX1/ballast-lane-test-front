import React, { useState } from 'react';
import { Card, Typography, Input, Button, Space, message } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../useCases/useLogin';
import { AnimatedDiv, Pressable } from '../../../components/Animated';

const { Title } = Typography;

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async () => {
    setLoading(true);
    try {
      const status = await useLogin(email, password);
      if (status === 200) {
        message.success('Logged in');
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
      <AnimatedDiv>
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
            <Pressable>
              <Button type="primary" loading={loading} block onClick={onSubmit}>
                Sign In
              </Button>
            </Pressable>
            <Button type="link" block onClick={() => navigate('/sign-up')}>
              Don’t have an account? Sign up
            </Button>
          </Space>
        </Card>
      </AnimatedDiv>
    </div>
  );
};

export default Login;
