"use client";

import React, { useState } from "react";
import { Button, Upload, Select, notification } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { Switch } from "@headlessui/react";
import { useAddEmployee } from "@/hooks/employees/useAddEmployee";
import { CreateEmployeeDto } from "@/hooks/employees/CreateEmployeeDto";
import { useJobTitles } from "@/hooks/employees/job-titles/useJobTitles";
import { useSubUnits } from "@/hooks/employees/sub-units/useSubUnits";
import { useUserStatuses } from "@/hooks/user-statuses/useUserStatuses";
import { useGetEmployeeStatus } from "@/hooks/employees/employee-statuses/useGetEmployeeStatus";

const { Option } = Select;

export default function AddEmployeePage() {
  const { addEmployee } = useAddEmployee();
  const { jobTitles, error: jobTitleError } = useJobTitles();
  const { subUnits, error: subUnitError } = useSubUnits();
  const { employeeStatuses, error: employeeStatusesEror } =
    useGetEmployeeStatus();
  const { userStatuses, error: userStatusError } = useUserStatuses();
  const [fieldErrors, setFieldErrors] = useState<{ confirmPassword?: string }>(
    {}
  );
  const [api, contextHolder] = notification.useNotification();
  const [loginEnabled, setLoginEnabled] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [userStatus, setUserStatus] = useState<"Active" | "Inactive">("Active");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [jobTitleId, setJobTitleId] = useState<string | undefined>(undefined);
  const [subUnitId, setSubUnitId] = useState<string | undefined>(undefined);
  const [employeeStatusId, setEmployeeStatusId] = useState<string | undefined>(
    undefined
  );
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setJobTitleId("");
    setSubUnitId("");
    setEmployeeStatusId("");
    setLoginEnabled(false);
    setUsername("");
    setPassword("");
    setConfirmPassword("");
    setUserStatus("Active");
    setAvatarUrl(null);
    setFieldErrors({});
  };

  const handleSubmit = async () => {
    const selectedStatus = userStatuses.find((s) => s.name === userStatus);
    try {
      const payload: CreateEmployeeDto = {
        firstName,
        lastName,
        imageUrl: avatarUrl ?? undefined,
        jobTitleId,
        subUnitId,
        employeeStatusId,
        createLogin: loginEnabled,
        ...(loginEnabled && {
          user: {
            userName: username,
            password,
            userStatusId: selectedStatus?.id ?? "",
          },
        }),
      };

      await addEmployee(payload);
      console.log("Employee created successfully!");
      api.success({
        message: "Employee created successfully!",
        description: `Employee ${firstName} ${lastName} has been added.`,
        placement: "bottomLeft",
      });
      resetForm();
    } catch (err: any) {
      api.error({
        message: "Employee created failed!",
        description: err?.message || "An unknown error occurred.",
        placement: "bottomLeft",
      });
    }
  };

  return (
    <>
      {contextHolder}
      <div className="flex-1 w-full p-4 mt-2 space-y-6">
        <div className="flex-col px-8 py-4 bg-white border-gray-200 rounded-lg shadow-sm sm:flex-row">
          <h2 className="pb-2 text-xl font-semibold text-gray-500 border-b border-gray-400">
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
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
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
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="w-full text-sm text-gray-500 font-small">
                    Sub Unit
                  </label>
                  <Select
                    value={subUnitId}
                    onChange={(value) => setSubUnitId(value)}
                    className="w-full !mt-2"
                    placeholder="--Select--"
                  >
                    {subUnits.map((sub) => (
                      <Option key={sub.id} value={sub.id}>
                        {sub.name}
                      </Option>
                    ))}
                  </Select>

                  {subUnitError && (
                    <p className="mt-1 text-sm text-red-500">{subUnitError}</p>
                  )}
                </div>
                <div>
                  <label className="w-full mb-2 text-sm text-gray-500 font-small">
                    Employee Job
                  </label>
                  <Select
                    value={jobTitleId}
                    onChange={(value) => setJobTitleId(value)}
                    className="w-full !mt-2"
                    placeholder="--Select--"
                  >
                    {jobTitles.map((job) => (
                      <Option key={job.id} value={job.id}>
                        {job.name}
                      </Option>
                    ))}
                  </Select>

                  {jobTitleError && (
                    <p className="mt-1 text-sm text-red-500">{jobTitleError}</p>
                  )}
                </div>

                <div>
                  <label className="w-full mb-2 text-sm text-gray-500 font-small">
                    Employee Status
                  </label>
                  <Select
                    value={employeeStatusId}
                    onChange={(value) => setEmployeeStatusId(value)}
                    className="w-full !mt-2"
                    placeholder="--Select--"
                    allowClear
                  >
                    {employeeStatuses.map((status) => (
                      <Option key={status.id} value={status.id}>
                        {status.name}
                      </Option>
                    ))}
                  </Select>

                  {employeeStatusesEror && (
                    <p className="mt-1 text-sm text-red-500">
                      {employeeStatusesEror}
                    </p>
                  )}
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
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Status</label>
                    <div className="flex flex-wrap gap-4 mt-2">
                      {userStatuses.map((status) => (
                        <label
                          key={status.id}
                          className="inline-flex items-center gap-1 text-sm text-gray-700"
                        >
                          <input
                            type="radio"
                            name="userStatus"
                            value={status.name}
                            checked={userStatus === status.name}
                            onChange={(e) =>
                              setUserStatus(
                                e.target.value as "Active" | "Inactive"
                              )
                            }
                            className="w-4 h-4"
                          />
                          {status.name}
                        </label>
                      ))}
                    </div>
                    {userStatusError && (
                      <p className="mt-1 text-sm text-red-500">
                        {userStatusError}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <label className="mt-4 text-sm text-gray-500">
                      Password*
                    </label>
                    <input
                      className="w-full px-3 py-2 !mt-1 text-sm bg-white border border-gray-200 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
                      type="password"
                      placeholder="Enter new password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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
                      className={`w-full px-3 py-2 !mt-1 text-sm bg-white border border-gray-200 rounded-md focus:outline-none focus:ring focus:ring-blue-400 ${
                        fieldErrors.confirmPassword
                          ? "border-red-400 focus:ring focus:ring-red-200"
                          : "border-gray-200"
                      }`}
                      value={confirmPassword}
                      onChange={(e) => {
                        const value = e.target.value;
                        setConfirmPassword(value);

                        if (value !== password) {
                          setFieldErrors((prev) => ({
                            ...prev,
                            confirmPassword: "Passwords do not match",
                          }));
                        } else {
                          setFieldErrors((prev) => ({
                            ...prev,
                            confirmPassword: undefined,
                          }));
                        }
                      }}
                    />

                    {fieldErrors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-500">
                        {fieldErrors.confirmPassword}
                      </p>
                    )}
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
                  onClick={handleSubmit}
                >
                  + Apply
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
