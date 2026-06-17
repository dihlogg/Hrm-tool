"use client";

import { Card, Row, Col, Typography, List, Avatar, Tag, Progress, Badge, Space, Spin, Skeleton } from "antd";
import { 
  TrophyOutlined, 
  MessageOutlined, 
  LikeOutlined, 
  BellOutlined, 
  UserOutlined,
  UsergroupAddOutlined
} from "@ant-design/icons";

const { Title, Text } = Typography;
import { useDashboardData } from "@/hooks/dashboard/useDashboardData";
import { useRouter } from "next/navigation";
import { usePatchMarkAsRead } from "@/hooks/notifications/usePatchMarkAsRead";

import dynamic from "next/dynamic";

// Dynamically import charts with Spin fallback to avoid blank screen during client-side hydration
const Pie = dynamic(() => import("@ant-design/plots").then((mod) => mod.Pie), { 
  ssr: false,
  loading: () => <div className="flex justify-center items-center h-48"><Spin /></div>
});
const Funnel = dynamic(() => import("@ant-design/plots").then((mod) => mod.Funnel), { 
  ssr: false,
  loading: () => <div className="flex justify-center items-center h-48"><Spin /></div>
});
const Column = dynamic(() => import("@ant-design/plots").then((mod) => mod.Column), { 
  ssr: false,
  loading: () => <div className="flex justify-center items-center h-48"><Spin /></div>
});

export default function DashboardPage() {
  const router = useRouter();
  const {
    leaveStats,
    jobStats,
    funnelStats,
    myLeaveBalances,
    recentEmployees,
    trendingPosts,
    recentNotifications,
    loading
  } = useDashboardData();
  const { markAsRead } = usePatchMarkAsRead();

  const handleNotificationClick = async (notificationId: string, isRead: boolean) => {
    if (!isRead) {
      await markAsRead(notificationId);
      // We could re-fetch data, but to avoid full dashboard reload, 
      // let's just trigger a reload if we had a dedicated refresh method.
      // For now, the user can refresh to see it removed, or we can just navigate.
    }
    // Optional navigation logic here based on notification type
  };

  if (loading) {
    return (
      <div className="p-6 pb-20 flex justify-center items-center h-[80vh]">
        <Spin size="large" />
      </div>
    );
  }

  const pieConfig = {
    height: 260,
    autoFit: true,
    angleField: 'count',
    colorField: 'status',
    label: { text: 'count', position: 'outside' },
    legend: { color: { title: false, position: 'bottom', rowPadding: 5 } }
  };

  const donutConfig = {
    ...pieConfig,
    innerRadius: 0.6,
  };

  const funnelConfig = {
    height: 260,
    autoFit: true,
    xField: 'status',
    yField: 'count',
    label: false,
    shapeField: 'funnel',
  };

  return (
    <div className="p-6 pb-20">
      <Title level={3} className="mb-6 text-gray-700">Enterprise HRM Dashboard</Title>
      
      <Row gutter={[24, 24]}>
        {/* HÀNG 1: 3 Biểu đồ tổng quan */}
        <Col xs={24} md={12} lg={8}>
          <Card title="Leave Requests Status" className="h-full shadow-sm rounded-xl">
            {leaveStats.length > 0 ? <Pie data={leaveStats} {...pieConfig} /> : <div className="text-center text-gray-400 py-10">No data</div>}
          </Card>
        </Col>

        <Col xs={24} md={12} lg={8}>
          <Card title="Job Openings Status" className="h-full shadow-sm rounded-xl">
            {jobStats.length > 0 ? <Pie data={jobStats} {...donutConfig} /> : <div className="text-center text-gray-400 py-10">No data</div>}
          </Card>
        </Col>

        <Col xs={24} md={24} lg={8}>
          <Card title="Recruitment Pipeline" className="h-full shadow-sm rounded-xl">
            {funnelStats.length > 0 ? <Funnel data={funnelStats} {...funnelConfig} /> : <div className="text-center text-gray-400 py-10">No data</div>}
          </Card>
        </Col>

        {/* HÀNG 2: Quỹ phép cá nhân & Nhân sự mới */}
        <Col xs={24} lg={12}>
          <Card title="My Leave Balances" className="h-full shadow-sm rounded-xl">
            {myLeaveBalances.length > 0 ? (
              <div className="flex flex-col gap-4 mt-2">
                {myLeaveBalances.map((leave, idx) => (
                  <div key={idx} className="flex flex-col gap-1">
                    <div className="flex justify-between text-sm font-medium">
                      <span>{leave.leaveRequestTypeName}</span>
                      <span>{leave.remainingQuotas} / {leave.maximumAllowed} Days Left</span>
                    </div>
                    <Progress 
                      percent={leave.maximumAllowed ? (leave.remainingQuotas / leave.maximumAllowed) * 100 : 0} 
                      strokeColor={idx === 0 ? '#1890ff' : idx === 1 ? '#52c41a' : '#faad14'} 
                      showInfo={false} 
                      strokeWidth={12} 
                    />
                  </div>
                ))}
              </div>
            ) : (
               <div className="text-center text-gray-400 py-10">No leave fund data</div>
            )}
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title={<><UsergroupAddOutlined className="text-blue-500 mr-2" /> Recent New Hires</>} className="h-full shadow-sm rounded-xl">
            <List
              itemLayout="horizontal"
              dataSource={recentEmployees}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar src={item.imageUrl} className="bg-green-500 text-white">{item.firstName?.charAt(0) || <UserOutlined />}</Avatar>}
                    title={<a className="font-semibold text-blue-600 hover:underline">{item.firstName} {item.lastName}</a>}
                    description={item.jobTitle?.name || "Employee"}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* HÀNG 3: Mạng xã hội & Thông báo */}
        <Col xs={24} lg={14}>
          <Card title="Trending on HRM Buzz" className="h-full shadow-sm rounded-xl">
            <List
              itemLayout="vertical"
              dataSource={trendingPosts}
              renderItem={(item) => (
                <List.Item 
                  className="bg-gray-50 mb-3 rounded-lg !px-4 border border-gray-100 cursor-pointer hover:bg-gray-200 transition-all duration-200"
                  onClick={() => router.push('/buzz')}
                >
                  <List.Item.Meta
                    avatar={<Avatar src={item.employeeAvatarUrl} className="bg-gray-300 text-gray-600 mt-1">{item.employeeFullName?.charAt(0) || 'A'}</Avatar>}
                    title={<span className="font-semibold text-gray-800">{item.employeeFullName || "Anonymous"}</span>}
                    description={
                      <div className="flex flex-col mt-1">
                        <div className="text-gray-700 text-base line-clamp-2">{item.content}</div>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        <Col xs={24} lg={10}>
          <Card title={<><BellOutlined className="text-red-500 mr-2" /> Actionable Tasks & Alerts</>} className="h-full shadow-sm rounded-xl">
            <List
              itemLayout="horizontal"
              dataSource={recentNotifications}
              renderItem={(item) => (
                <List.Item 
                  className="hover:bg-gray-50 cursor-pointer p-2 rounded transition-colors"
                  onClick={async () => {
                    await handleNotificationClick(item._id, item.read);
                  }}
                >
                  <List.Item.Meta
                    avatar={<Badge dot color={item.read ? "gray" : "blue"}><Avatar icon={<BellOutlined />} /></Badge>}
                    title={<span className="text-gray-800 text-sm">{item.content || item.message}</span>}
                    description={<span className="text-xs text-gray-400">{new Date(item.createdAt).toLocaleDateString()}</span>}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}