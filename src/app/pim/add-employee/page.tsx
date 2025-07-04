"use client";

import React, { useState } from "react";
import { Form, Input, Button, Radio, Upload, Select } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { Switch } from "@headlessui/react";

const { Option } = Select;

export default function AddEmployeePage() {
  const [form] = Form.useForm();
  const [loginEnabled, setLoginEnabled] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  return (
    <div className="flex-1 w-full p-4 mt-2 space-y-6">
      <div className="flex-col px-8 py-4 bg-white border-gray-200 rounded-lg shadow-sm sm:flex-row">
        <h2 className="pb-2 text-xl font-semibold text-gray-500 border-b border-b-gray-400">
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
                return false;
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
          <div className="flex-col w-full px-8 py-4 border-gray-200 rounded-lg sm:flex-row">
            <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-2">
              <div className="flex flex-col items-start">
                <label className="w-full mb-1 text-sm text-gray-500 font-small">
                  First Name
                </label>
                <input
                  className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
                  type="text"
                  placeholder="Type for hints..."
                />
              </div>

              <div className="flex flex-col items-start">
                <label className="w-full mb-1 text-sm text-gray-500 font-small">
                  Last Name
                </label>
                <input
                  className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
                  type="text"
                  placeholder="Type for hints..."
                />
              </div>
              <div>
                <label className="w-full text-sm text-gray-500 font-small">
                  Status
                </label>
                <Select
                  defaultValue="--Select--"
                  className="w-full !mt-1 custom-ant-select"
                >
                  <Option value="--Select--">--Select--</Option>
                  <Option value="full-time">Enabled</Option>
                  <Option value="part-time">Disabled</Option>
                </Select>
              </div>
              <div>
                <label className="w-full mb-2 text-sm text-gray-500 font-small">
                  Employee Job
                </label>
                <Select defaultValue="--Select--" className="w-full !mt-1">
                  <Option value="--Select--">--Select--</Option>
                  <Option value="current">Admin</Option>
                  <Option value="past">ESS</Option>
                </Select>
              </div>
            </div>

            <div className="flex items-center w-full space-x-4 justify-stretch">
              <label className="text-sm font-medium text-gray-500">
                Create Login Details
              </label>
              <Switch
                checked={loginEnabled}
                onChange={setLoginEnabled}
                className={`${
                  loginEnabled ? "bg-orange-500" : "bg-gray-300"
                } relative inline-flex h-[20px] w-[44px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none`}
              >
                <span
                  className={`${
                    loginEnabled ? "translate-x-6" : "translate-x-0"
                  } inline-block h-[16px] w-[16px] transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                />
              </Switch>
            </div>
            {loginEnabled && (
              <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 bg-[#F1F5F9] mt-4 px-4 py-2 rounded-xl">
                <div className="flex flex-col items-start">
                  <label className="w-full mb-1 text-sm text-gray-500 font-small">
                    User Name
                  </label>
                  <input
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
                    type="text"
                    placeholder="Type for hints..."
                  />
                </div>
                <div className="flex flex-col items-start">
                  <label className="w-full mb-1 text-sm text-gray-500 font-small">
                    Status
                  </label>
                  <Radio.Group className="flex gap-6">
                    <Radio style={{ color: "#6B7280" }} value="Enabled">
                      Enabled
                    </Radio>
                    <Radio style={{ color: "#6B7280" }} value="Disabled">
                      Disabled
                    </Radio>
                  </Radio.Group>
                </div>
                <div className="flex flex-col">
                  <label className="mt-4 text-sm text-gray-500">
                    Password*
                  </label>
                  <input
                    type="password"
                    placeholder="Enter new password"
                    className="w-full px-3 py-2 !mt-1 text-sm bg-white border border-gray-200 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
                  />
                  <p className="!mt-2 text-sm text-gray-500">
                    For a strong password, please use a hard to guess
                    combination with upper and lower case characters, symbols,
                    and numbers
                  </p>
                </div>
                <div className="flex flex-col">
                  <label className="mt-4 text-sm text-gray-500">
                    Confirm Password*
                  </label>
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    className="w-full !mt-1 px-3 py-2 text-sm bg-white border border-gray-200 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
                  />
                </div>
              </div>
            )}
            <div className="flex items-center justify-between mt-6">
              <span className="text-sm italic font-medium text-gray-500">
                * Required
              </span>
              <Button
                type="primary"
                shape="round"
                size="middle"
                className="text-white bg-blue-500 hover:bg-blue-600"
              >
                + Apply
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
