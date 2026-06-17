"use client";

import { Card, Row, Col, Typography, List, Avatar, Tag, Progress, Badge, Space, Spin } from "antd";
import { 
  TrophyOutlined, 
  MessageOutlined, 
  LikeOutlined, 
  BellOutlined, 
  UserOutlined 
} from "@ant-design/icons";

const { Title, Text } = Typography;

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
  // 1. Thống kê đơn nghỉ phép (Core)
  const mockLeaveStats = [
    { status: 'APPROVED', count: 15 },
    { status: 'PENDING', count: 5 },
    { status: 'REJECTED', count: 2 },
  ];

  // 2. Tình trạng tin tuyển dụng (ATS)
  const mockJobStats = [
    { status: 'OPEN', count: 12 },
    { status: 'CLOSED', count: 4 },
    { status: 'DRAFT', count: 1 },
  ];

  // 3. Phễu tuyển dụng (ATS)
  const mockFunnelStats = [
    { status: 'PARSING', count: 120 },
    { status: 'MATCHED', count: 45 },
    { status: 'INTERVIEWING', count: 15 },
    { status: 'HIRED', count: 4 },
  ];

  // 4. Quỹ phép cá nhân (Core)
  const mockLeaveBalances = [
    { type: 'Annual Leave', total: 12, taken: 4, remaining: 8, color: '#1890ff' },
    { type: 'Sick Leave', total: 5, taken: 1, remaining: 4, color: '#52c41a' },
    { type: 'Unpaid Leave', total: 10, taken: 0, remaining: 10, color: '#faad14' },
  ];

  // 5. Top Ứng viên AI đánh giá cao (ATS)
  const mockTopCandidates = [
    { id: 1, name: "Nguyen Van A", role: "Senior Frontend Engineer", matchScore: 92 },
    { id: 2, name: "Tran Thi B", role: "Backend Developer (NodeJS)", matchScore: 88 },
    { id: 3, name: "Le Van C", role: "UI/UX Designer", matchScore: 85 },
    { id: 4, name: "Pham Thi D", role: "DevOps Engineer", matchScore: 81 },
  ];

  // 6. Bài viết Mạng xã hội nổi bật (Social)
  const mockTrendingPosts = [
    { id: 1, author: "HR Department", content: "🎉 Welcome our new members this July!", likes: 45, comments: 12 },
    { id: 2, author: "CEO", content: "Great quarter everyone! Keep up the good work 🚀", likes: 120, comments: 30 },
    { id: 3, author: "John Doe", content: "Anyone up for football this Friday?", likes: 15, comments: 8 },
  ];

  // 7. Thông báo cần xử lý (Notify)
  const mockNotifications = [
    { id: 1, type: "leave", msg: "Hoang requested Annual Leave (2 days)", time: "10 mins ago", color: "blue" },
    { id: 2, type: "mention", msg: "Anna mentioned you in a comment", time: "1 hour ago", color: "orange" },
    { id: 3, type: "job", msg: "New CV parsed for Backend Developer", time: "2 hours ago", color: "green" },
  ];

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
            <Pie data={mockLeaveStats} {...pieConfig} />
          </Card>
        </Col>

        <Col xs={24} md={12} lg={8}>
          <Card title="Job Openings Status" className="h-full shadow-sm rounded-xl">
            <Pie data={mockJobStats} {...donutConfig} />
          </Card>
        </Col>

        <Col xs={24} md={24} lg={8}>
          <Card title="Recruitment Pipeline" className="h-full shadow-sm rounded-xl">
            <Funnel data={mockFunnelStats} {...funnelConfig} />
          </Card>
        </Col>

        {/* HÀNG 2: Quỹ phép cá nhân & Top Ứng viên */}
        <Col xs={24} lg={12}>
          <Card title="My Leave Balances" className="h-full shadow-sm rounded-xl">
            <div className="flex flex-col gap-4 mt-2">
              {mockLeaveBalances.map((leave, idx) => (
                <div key={idx} className="flex flex-col gap-1">
                  <div className="flex justify-between text-sm font-medium">
                    <span>{leave.type}</span>
                    <span>{leave.remaining} / {leave.total} Days Left</span>
                  </div>
                  <Progress 
                    percent={(leave.remaining / leave.total) * 100} 
                    strokeColor={leave.color} 
                    showInfo={false} 
                    strokeWidth={12} 
                  />
                </div>
              ))}
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title={<><TrophyOutlined className="text-yellow-500 mr-2" /> Top AI Matched Candidates</>} className="h-full shadow-sm rounded-xl">
            <List
              itemLayout="horizontal"
              dataSource={mockTopCandidates}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Tag color="green" key="score">{item.matchScore}% Match</Tag>
                  ]}
                >
                  <List.Item.Meta
                    avatar={<Avatar icon={<UserOutlined />} />}
                    title={<a className="font-semibold text-blue-600 hover:underline">{item.name}</a>}
                    description={item.role}
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
              dataSource={mockTrendingPosts}
              renderItem={(item) => (
                <List.Item className="bg-gray-50 mb-3 rounded-lg !px-4 border border-gray-100">
                  <List.Item.Meta
                    avatar={<Avatar className="bg-gray-300 text-gray-600 mt-1">{item.author.charAt(0)}</Avatar>}
                    title={<span className="font-semibold text-gray-800">{item.author}</span>}
                    description={
                      <div className="flex flex-col mt-1">
                        <div className="text-gray-700 text-base">{item.content}</div>
                        <Space className="text-gray-500 mt-3">
                          <span className="flex items-center gap-1 hover:text-blue-500 cursor-pointer transition-colors"><LikeOutlined /> {item.likes}</span>
                          <span className="flex items-center gap-1 ml-4 hover:text-blue-500 cursor-pointer transition-colors"><MessageOutlined /> {item.comments}</span>
                        </Space>
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
              dataSource={mockNotifications}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Badge dot color={item.color}><Avatar icon={<BellOutlined />} /></Badge>}
                    title={<span className="text-gray-800 text-sm">{item.msg}</span>}
                    description={<span className="text-xs text-gray-400">{item.time}</span>}
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