"use client";

import React, { useEffect, useState } from "react";
import { Button, Upload, Select, notification, DatePicker } from "antd";
import { UploadOutlined, UserAddOutlined } from "@ant-design/icons";
import { CreateEmployeeDto } from "@/hooks/employees/CreateEmployeeDto";
import { useSearchParams } from "next/navigation";
import { useGetEmployeeById } from "@/hooks/employees/useGetEmployeeById";
import dayjs, { Dayjs } from "dayjs";
import { useUpdateEmployee } from "@/hooks/employees/useUpdateEmployee";

const { Option } = Select;

export default function ProfilePage() {
  const { updateEmployee } = useUpdateEmployee();
  const searchParams = useSearchParams();
  const employeeId = searchParams.get("id") || undefined;
  const { employee, loading } = useGetEmployeeById(employeeId ?? "");
  const [api, contextHolder] = notification.useNotification();

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [empId, setEmpId] = useState(employeeId || "");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [employmentType, setEmploymentType] = useState("--Select--");
  const [nationality, setNationality] = useState("--Select--");
  const [gender, setGender] = useState("--Select--");
  const [dateOfBirth, setDateOfBirth] = useState<Dayjs | null>(null);

  useEffect(() => {
    if (employee) {
      setFirstName(employee.firstName || "");
      setLastName(employee.lastName || "");
      setAvatarUrl(employee.imageUrl || null);
      setEmail(employee.email || "");
      setPhoneNumber(employee.phoneNumber || "");
      setAddress(employee.address || "");
      setEmpId(employee.id || "");
      setEmploymentType(employee.employmentType || "--Select--");
      setNationality(employee.nationality || "--Select--");
      setGender(employee.gender || "--Select--");
      setDateOfBirth(employee.dayOfBirth ? dayjs(employee.dayOfBirth) : null);
    }
  }, [employee]);

  const handleSubmit = async () => {
    try {
      const payload: CreateEmployeeDto = {
        id: employeeId,
        firstName,
        lastName,
        imageUrl: avatarUrl ?? undefined,
        email,
        phoneNumber,
        address,
        gender,
        employmentType,
        nationality,
        dayOfBirth: dateOfBirth?.toISOString(),
      };

      await updateEmployee(employeeId!, payload);
      api.success({
        message: "Employee Update Successfully!",
        description: `Employee information has been updated.`,
        placement: "bottomLeft",
        duration: 3,
        pauseOnHover: true,
      });
    } catch (err: any) {
      api.error({
        message: "Update failed!",
        description: err?.message || "An unknown error occurred.",
        placement: "bottomLeft",
        duration: 3,
        pauseOnHover: true,
      });
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <>
      {contextHolder}
      <div className="flex-1 w-full p-4 mt-2 space-y-6">
        <div className="flex-col px-8 py-4 bg-white border-gray-200 rounded-lg shadow-sm sm:flex-row">
          <h2 className="pb-2 text-xl font-semibold text-gray-500 border-b border-gray-400">
            Personal Details
          </h2>
          <div className="flex flex-col gap-6 pt-1 md:flex-row">
            {/* Left: Avatar */}
            <div className="flex flex-col items-center">
              <div className="relative w-[180px] h-[180px]">
                <div className="flex items-center justify-center w-full h-full overflow-hidden text-5xl text-gray-400 bg-gray-100 rounded-full">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="Avatar"
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <span>
                      <UserAddOutlined style={{ fontSize: 40 }} />
                    </span>
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
                    shape="circle"
                    className="absolute text-white bg-orange-500 border-none shadow-lg bottom-10 left-33 hover:bg-orange-600"
                  />
                </Upload>
              </div>
            </div>

            {/* Right: Persional Details */}
            <div className="flex-col w-full px-8 py-4 border-gray-200 rounded-lg sm:flex-row">
              <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-2">
                <div className="flex flex-col items-start">
                  <label className="w-full mb-1 text-sm text-gray-500 font-small">
                    First Name
                  </label>
                  <input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
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
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
                    type="text"
                    placeholder="Type for hints..."
                  />
                </div>

                <div className="flex flex-col items-start">
                  <label className="w-full mb-1 text-sm text-gray-500 font-small">
                    Employee Id
                  </label>
                  <input
                    value={`#${empId.slice(0, 8)}`}
                    readOnly
                    onChange={(e) => setEmpId(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
                    type="text"
                    placeholder="Type for hints..."
                  />
                </div>

                <div className="flex flex-col items-start">
                  <label className="w-full mb-1 text-sm text-gray-500 font-small">
                    Email
                  </label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
                    type="text"
                    placeholder="Type for hints..."
                  />
                </div>

                <div className="flex flex-col items-start">
                  <label className="w-full mb-1 text-sm text-gray-500 font-small">
                    Phone Number
                  </label>
                  <input
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
                    type="text"
                    placeholder="Type for hints..."
                  />
                </div>

                <div className="flex flex-col items-start">
                  <label className="w-full mb-1 text-sm text-gray-500 font-small">
                    Address
                  </label>
                  <input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
                    type="text"
                    placeholder="Type for hints..."
                  />
                </div>

                <div>
                  <label className="w-full mb-2 text-sm text-gray-500 font-small">
                    Employment Type
                  </label>
                  <Select
                    value={employmentType}
                    onChange={(value) => setEmploymentType(value)}
                    className="w-full !mt-1 custom-ant-select"
                    placeholder="--Select--"
                  >
                    <Option value="Official">Official</Option>
                    <Option value="Temporary">Temporary</Option>
                    <Option value="On Leave">On Leave</Option>
                  </Select>
                </div>

                <div className="flex flex-col items-start">
                  <label className="w-full mb-1 text-sm text-gray-500 font-small">
                    Date Of Birth
                  </label>
                  <DatePicker
                    value={dateOfBirth}
                    onChange={(date) => setDateOfBirth(date)}
                    className="w-full px-3 py-1 text-sm bg-white border border-gray-200 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
                    placeholder="Select date"
                  />
                </div>

                <div>
                  <label className="w-full text-sm text-gray-500 font-small">
                    Gender
                  </label>
                  <Select
                    value={gender}
                    onChange={(value) => setGender(value)}
                    className="w-full !mt-1 custom-ant-select"
                    placeholder="--Select--"
                  >
                    <Option value="full-time">Male</Option>
                    <Option value="part-time">Female</Option>
                  </Select>
                </div>

                <div>
                  <label className="w-full text-sm text-gray-500 font-small">
                    Nationality
                  </label>
                  <Select
                    value={nationality}
                    onChange={(value) => setNationality(value)}
                    className="w-full !mt-1 custom-ant-select"
                    placeholder="--Select--"
                  >
                    <Option value="full-time">VietNam</Option>
                    <Option value="part-time">China</Option>
                  </Select>
                </div>
              </div>
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
