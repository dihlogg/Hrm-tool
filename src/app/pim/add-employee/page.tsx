"use client";

import React, { useState } from "react";
import { Form, Input, Button, Switch, Radio, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";

export default function AddEmployee() {
  const [form] = Form.useForm();
  const [loginEnabled, setLoginEnabled] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  return (
    <div className="flex-1 w-full p-4 space-y-6">
      <div className="flex-col px-8 py-4 bg-white border-gray-200 rounded-lg shadow-sm sm:flex-row">
        <h2 className="pb-2 mb-6 text-xl font-semibold border-b">
          Add Employee
        </h2>
        <div className="flex flex-col gap-6 md:flex-row">
          {/* Left: Upload Avatar */}
          <div className="flex flex-col items-center">
            <div className="w-[200px] h-[200px] rounded-full overflow-hidden bg-gray-100 flex items-center justify-center text-gray-400 text-5xl">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Avatar"
                  className="object-cover w-full h-full"
                />
              ) : (
                <span>👤</span>
              )}
            </div>

            <Upload
              showUploadList={false}
              beforeUpload={(file) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                  setAvatarUrl(e.target?.result as string);
                };
                reader.readAsDataURL(file);
                return false; // ngăn không upload lên server
              }}
            >
              <Button
                icon={<UploadOutlined />}
                className="mt-2 text-white bg-orange-500 hover:bg-orange-600"
                shape="circle"
              />
            </Upload>

            <p className="mt-2 text-xs text-center text-gray-500">
              Accepts jpg, png, gif up to 1MB.
              <br />
            </p>
          </div>

          {/* Right: Form */}
          <Form
            form={form}
            layout="vertical"
            className="flex-1"
            onFinish={(values) => console.log(values)}
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Form.Item
                name="firstName"
                label="First Name"
                rules={[{ required: true, message: "Required" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="lastName"
                label="Last Name"
                rules={[{ required: true, message: "Required" }]}
              >
                <Input />
              </Form.Item>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Form.Item
                name="employeeJob"
                label="Employee Job"
                rules={[{ required: true, message: "Required" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="employeeStatus"
                label="Status"
                rules={[{ required: true, message: "Required" }]}
              >
                <Input />
              </Form.Item>
            </div>

            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Create Login Details</span>
              <Switch
                checked={loginEnabled}
                onChange={(val) => setLoginEnabled(val)}
                className="bg-orange-500"
              />
            </div>
            {loginEnabled && (
              <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Form.Item
                    name="userName"
                    label="User name"
                    rules={[{ required: true, message: "Required" }]}
                  >
                    <Input />
                  </Form.Item>

                  <div className="flex items-center gap-6 mb-4">
                    <Form.Item
                      label="Status"
                      name="status"
                      className="mb-4"
                      labelCol={{ span: 24 }}
                    >
                      <Radio.Group className="flex gap-6">
                        <Radio value="Enabled">Enabled</Radio>
                        <Radio value="Disabled">Disabled</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Form.Item
                    name="password"
                    label="Password"
                    rules={[{ required: true, message: "Required" }]}
                  >
                    <Input.Password />
                  </Form.Item>
                  <Form.Item
                    name="confirmPassword"
                    label="Confirm Password"
                    rules={[{ required: true, message: "Required" }]}
                  >
                    <Input.Password />
                  </Form.Item>
                </div>
                <p className="text-xs text-gray-500">
                  For a strong password, please use a hard to guess combination
                  with upper and lower case characters, symbols, and numbers
                </p>
              </>
            )}

            <div className="grid justify-end grid-flow-col gap-1 mt-6">
              <Button
                type="primary"
                shape="round"
                size="middle"
                ghost
                className="text-blue-500"
              >
                Cancel
              </Button>
              <Button
                type="primary"
                shape="round"
                size="middle"
                className="text-white bg-blue-500 hover:bg-blue-600"
              >
                + Apply
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
