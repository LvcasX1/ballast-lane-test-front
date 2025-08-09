import React, { useState } from 'react';
import { Card, Typography, Input, Button, Space, Form, message } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useSignUp } from '../useCases/useSignUp';

const { Title } = Typography;

const SignUp: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const status = await useSignUp({
        name: values.name,
        email_address: values.email_address,
        password: values.password,
        password_confirmation: values.password_confirmation,
      });
      if (status === 200 || status === 201) {
        message.success('Account created, please sign in');
        navigate('/login');
      }
    } catch (e: any) {
      message.error(e?.message || 'Sign up failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}>
      <Card style={{ width: '100%', maxWidth: 480 }}>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <Title level={3} style={{ textAlign: 'center', margin: 0 }}>Sign Up</Title>
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please enter your name' }]}>
              <Input prefix={<UserOutlined />} placeholder="John Doe" />
            </Form.Item>
            <Form.Item name="email_address" label="Email" rules={[{ required: true, type: 'email', message: 'Enter a valid email' }]}>
              <Input prefix={<MailOutlined />} placeholder="john.doe@example.com" />
            </Form.Item>
            <Form.Item name="password" label="Password" rules={[{ required: true, min: 6 }]}>
              <Input.Password prefix={<LockOutlined />} placeholder="••••••••" />
            </Form.Item>
            <Form.Item
              name="password_confirmation"
              label="Confirm Password"
              dependencies={["password"]}
              rules={[
                { required: true, message: 'Please confirm your password' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Passwords do not match'));
                  },
                }),
              ]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="••••••••" />
            </Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Create account
            </Button>
            <Button type="link" block onClick={() => navigate('/login')}>
              Already have an account? Sign in
            </Button>
          </Form>
        </Space>
      </Card>
    </div>
  );
};

export default SignUp;
