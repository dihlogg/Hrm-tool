"use client";

import { useState } from "react";
import { Tabs, Card, Avatar, Button, Input, Space, Dropdown } from "antd";
import {
  CameraOutlined,
  DeleteOutlined,
  HeartOutlined,
  MessageOutlined,
  MoreOutlined,
  ShareAltOutlined,
  VideoCameraAddOutlined,
} from "@ant-design/icons";
import { mockMyRequests } from "@/utils/buzz/mock-data-buzz-page";

const { TextArea } = Input;

export default function BuzzPage() {
  const [posts, setPosts] = useState(mockMyRequests);
  const [inputValue, setInputValue] = useState("");

  // Handler khi nhấn nút Post
  const handlePost = () => {
    if (!inputValue.trim()) return;

    const newPost = {
      id: Date.now().toString(),
      user: mockMyRequests[0].user,
      content: inputValue,
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: 0,
      shares: 0,
    };

    setPosts([newPost, ...posts]);
    setInputValue("");
  };

  return (
    <div className="flex-1 w-full max-w-4xl p-4 mx-auto mt-6 space-y-6">
      <h2 className="text-xl font-semibold">Buzz Newsfeed</h2>
      {/* Post Editor Section */}
      <Card className="p-4 bg-white shadow-sm rounded-2xl">
        <div className="flex items-start gap-4">
          <Avatar src={mockMyRequests[0].user.avatarUrl} size={64} />
          <div className="flex-1">
            <TextArea
              name="postContent"
              rows={2}
              placeholder="What's on your mind?"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="px-4 py-2 bg-gray-100 border-none rounded-full focus:ring-0"
            />
            <div className="flex items-center justify-between mt-4">
              <div className="flex gap-4">
                <button className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white rounded-full shadow-md cursor-pointer hover:bg-gray-100">
                  <CameraOutlined className="text-xl text-green-600" />
                  Photos
                </button>
                <button className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white rounded-full shadow-md cursor-pointer hover:bg-gray-100">
                  <VideoCameraAddOutlined className="text-xl text-green-600" />
                  Video
                </button>
              </div>
              <Button
                type="primary"
                shape="round"
                size="large"
                onClick={handlePost}
                className="text-white bg-blue-500 hover:bg-blue-600"
              >
                Post
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs Section */}
      <Tabs
        defaultActiveKey="recent"
        items={[
          { key: "recent", label: "Most Recent Posts" },
          { key: "liked", label: "Most Liked Posts" },
          { key: "commented", label: "Most Commented Posts" },
        ]}
      />

      {/* Post List Section */}
      <div className="flex flex-col gap-5">
        {posts.map((post) => (
          <Card
            key={post.id}
            className="p-4 space-y-3 transition bg-white shadow-sm rounded-2xl hover:shadow-lg"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Avatar src={post.user.avatarUrl} size={48} />
                <div>
                  <div className="font-medium leading-tight">
                    {post.user.fullName}
                  </div>
                  <div className="text-sm text-gray-400">
                    {new Date(post.createdAt)
                      .toISOString()
                      .replace("T", " ")
                      .slice(0, 16)}
                  </div>
                </div>
              </div>

              {/* Dropdown */}
              <Dropdown
                trigger={["click"]}
                placement="bottomRight"
                menu={{
                  items: [
                    {
                      key: "delete",
                      label: <span className="text-red-500">Delete</span>,
                    },
                  ],
                }}
              >
                <Button
                  type="text"
                  icon={<MoreOutlined className="text-xl" />}
                  className="bg-gray-500 rounded-full hover:bg-gray-100"
                />
              </Dropdown>
            </div>

            <p className="py-2">{post.content}</p>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <Space size="large">
                <span className="flex items-center gap-1 cursor-pointer">
                  <HeartOutlined /> {post.likes} Likes
                </span>
                <span className="flex items-center gap-1 cursor-pointer">
                  <MessageOutlined /> {post.comments} Comments
                </span>
                <span className="flex items-center gap-1 cursor-pointer">
                  <ShareAltOutlined /> {post.shares} Shares
                </span>
              </Space>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
