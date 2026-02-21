import React from 'react';
import { Layout, Menu, Avatar, Typography, theme, App } from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  PieChartOutlined,
  LogoutOutlined,
  DashboardOutlined,
  SettingOutlined,
  ApartmentOutlined,
  BarChartOutlined,
  ShareAltOutlined,
  PayCircleOutlined,
  AuditOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types';

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;

const MainLayout = () => {
  const { message } = App.useApp();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    message.success('已退出登录');
    navigate('/login');
  };

  const getMenuItems = () => {
    const items = [
      {
        key: '/dashboard',
        icon: <DashboardOutlined />,
        label: '工作台',
      },
      {
        key: '/customers',
        icon: <TeamOutlined />,
        label: '客户管理',
      },
      {
        key: '/commission',
        icon: <PayCircleOutlined />,
        label: '提成测算',
      },
    ];

    if (user?.role === Role.ADMIN || user?.role === Role.FINANCE) {
      items.push({
        key: '/admin/payment',
        icon: <AuditOutlined />,
        label: '财务审批',
      });
    }

    if (user?.role === Role.ADMIN || user?.role === Role.MANAGER || user?.role === Role.SUPERVISOR) {
      items.push({
        key: '/admin/dashboard',
        icon: <PieChartOutlined />,
        label: '管理概览',
      });
    }

    if (user?.role === Role.ADMIN || user?.role === Role.HR) {
      items.push({
        key: '/admin/organization',
        icon: <ApartmentOutlined />,
        label: '组织架构',
      });
    }

    if (user?.role === Role.ADMIN) {
      items.push({
        key: '/admin/targets',
        icon: <BarChartOutlined />,
        label: '业绩指标',
      });
    }

    if (user?.role === Role.ADMIN || user?.role === Role.MANAGER) {
      items.push({
        key: '/admin/channel',
        icon: <ShareAltOutlined />,
        label: '渠道管理',
      });
    }

    if (user?.role === Role.ADMIN) {
      items.push({
        key: '/admin/settings',
        icon: <SettingOutlined />,
        label: '系统设置',
      });
    }

    return items;
  };

  const items = getMenuItems();

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        width={250}
        theme="light"
        style={{
          boxShadow: '2px 0 8px 0 rgba(29,35,41,.05)',
          zIndex: 10,
        }}
      >
        <div
          style={{
            height: 72,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          <Title level={4} style={{ margin: 0, color: '#1677ff' }}>
            CRM 系统
          </Title>
        </div>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={items}
          onClick={handleMenuClick}
          style={{ borderRight: 0, marginTop: 16 }}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: '0 48px',
            background: colorBgContainer,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 1px 4px rgba(0,21,41,.08)',
            zIndex: 1,
            height: 72,
          }}
        >
          <Title level={3} style={{ margin: 0 }}>
            {items.find((i) => i.key === location.pathname)?.label || 'CRM'}
          </Title>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                lineHeight: 1.2,
              }}
            >
              <Text strong style={{ fontSize: 16 }}>{user?.name}</Text>
              <Text type="secondary" style={{ fontSize: 13 }}>
                {user?.role}
              </Text>
            </div>
            <Avatar
              size="large"
              icon={<UserOutlined />}
              style={{ backgroundColor: '#1677ff', cursor: 'pointer' }}
            />
            <LogoutOutlined
              style={{ fontSize: 20, cursor: 'pointer', color: '#ff4d4f' }}
              onClick={() => {
                logout();
                navigate('/login');
              }}
            />
          </div>
        </Header>
        <Content
          style={{
            margin: '24px 24px 0',
            padding: 32,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
        <Layout.Footer style={{ textAlign: 'center', color: '#888' }}>
          Service System ©{new Date().getFullYear()} Created by Trae
        </Layout.Footer>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
