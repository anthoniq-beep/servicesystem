import { useState } from 'react';
import { Form, Input, Button, Card, Typography, App } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const { Title } = Typography;

const Login = () => {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      // GraphQL mutation for login
      const response = await api.post('/graphql', {
        query: `
          mutation Login($loginInput: LoginInput!) {
            login(loginInput: $loginInput) {
              accessToken
              user {
                id
                username
                name
                role
                departmentId
              }
            }
          }
        `,
        variables: {
          loginInput: values,
        },
      });

      if (response.data.errors) {
        throw new Error(response.data.errors[0].message);
      }

      const { accessToken, user } = response.data.data.login;
      login(accessToken, user);
      message.success('登录成功');
      navigate('/dashboard');
    } catch (error: any) {
      message.error(error.message || '登录失败，请检查用户名或密码');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' }}>
      <Card style={{ width: 400, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={3} style={{ color: '#1677ff' }}>CRM 系统登录</Title>
        </div>
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          size="large"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="用户名 (admin / manager1 / sales1)" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="密码 (password123)" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              登录
            </Button>
          </Form.Item>
          
          <div style={{ textAlign: 'center', color: '#888' }}>
             测试账号: admin / manager1 / sales1 <br/> 密码: password123
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
