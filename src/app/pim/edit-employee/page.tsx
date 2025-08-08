"use client";

import React, { useEffect, useState } from "react";
import { Button, Upload, Select, notification, DatePicker } from "antd";
import { UploadOutlined, UserAddOutlined } from "@ant-design/icons";
import { CreateEmployeeDto } from "@/hooks/employees/CreateEmployeeDto";
import { useSearchParams } from "next/navigation";
import { useGetEmployeeById } from "@/hooks/employees/useGetEmployeeById";
import dayjs, { Dayjs } from "dayjs";
import { useUpdateEmployee } from "@/hooks/employees/useUpdateEmployee";
import { useGetEmployeeStatus } from "@/hooks/employees/employee-statuses/useGetEmployeeStatus";
import { useJobTitles } from "@/hooks/employees/job-titles/useJobTitles";
import { useSubUnits } from "@/hooks/employees/sub-units/useSubUnits";

const { Option } = Select;

export default function EditEmployeePage() {
  const { updateEmployee } = useUpdateEmployee();
  const searchParams = useSearchParams();
  const employeeId = searchParams.get("id") || undefined;
  const { employee, loading } = useGetEmployeeById(employeeId ?? "");
  const [api, contextHolder] = notification.useNotification();

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);
  const [empId, setEmpId] = useState(employeeId || "");
  const [email, setEmail] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [nationality, setNationality] = useState<string | null>(null);
  const [gender, setGender] = useState<string | null>(null);
  const [dateOfBirth, setDateOfBirth] = useState<Dayjs | null>(null);

  const { employeeStatuses, error: employeeStatusesEror } =
    useGetEmployeeStatus();
  const [employeeStatusId, setEmployeeStatusId] = useState<string | null>(null);
  const { jobTitles, error: jobTitleError } = useJobTitles();
  const [jobTitleId, setJobTitleId] = useState<string | null>(null);
  const { subUnits, error: subUnitError } = useSubUnits();
  const [subUnitId, setSubUnitId] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<{
    firstName?: string;
    lastName?: string;
    jobTitleId?: string;
    subUnitId?: string;
    employeeStatusId?: string;
  }>({});

  useEffect(() => {
    if (employee) {
      setFirstName(employee.firstName ?? null);
      setLastName(employee.lastName ?? null);
      setImageUrl(employee.imageUrl ?? null);
      setEmail(employee.email ?? null);
      setPhoneNumber(employee.phoneNumber ?? null);
      setAddress(employee.address ?? null);
      setEmpId(employee.id ?? "");
      setNationality(employee.nationality ?? null);
      setGender(employee.gender ?? null);
      setDateOfBirth(employee.dayOfBirth ? dayjs(employee.dayOfBirth) : null);
      setEmployeeStatusId(employee.employeeStatusId ?? null);
      setJobTitleId(employee.jobTitleId ?? null);
      setSubUnitId(employee.subUnitId ?? null);
    }
  }, [employee]);

  const handleSubmit = async () => {
    try {
      const payload: CreateEmployeeDto = {
        id: employeeId,
        firstName: firstName || "",
        lastName: lastName || "",
        imageUrl: imageUrl ?? null,
        email: email ?? null,
        phoneNumber: phoneNumber ?? null,
        address: address ?? null,
        gender: gender ?? null,
        nationality: nationality ?? null,
        dayOfBirth: dateOfBirth?.toISOString() ?? null,
        employeeStatusId,
        jobTitleId,
        subUnitId,
      };

      const errors: typeof formErrors = {};

      if (!firstName?.trim()) errors.firstName = "*Required";
      if (!lastName?.trim()) errors.lastName = "*Required";
      if (!jobTitleId) errors.jobTitleId = "*Required";
      if (!subUnitId) errors.subUnitId = "*Required";
      if (!employeeStatusId) errors.employeeStatusId = "*Required";
      setFormErrors(errors);

      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }

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
                  {imageUrl ? (
                    <img
                      src={imageUrl}
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
                      setImageUrl(e.target?.result as string);
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
                  <label className="flex justify-between w-full mb-1 text-sm text-gray-500 font-small">
                    First Name
                    {formErrors.firstName && (
                      <span className="!mt-1 text-sm text-red-500">
                        {formErrors.firstName}
                      </span>
                    )}
                  </label>
                  <input
                    value={firstName ?? ""}
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
                    type="text"
                    placeholder="Type for hints..."
                    onChange={(e) => {
                      setFirstName(e.target.value);
                      setFormErrors((prev) => ({
                        ...prev,
                        firstName: undefined,
                      }));
                    }}
                  />
                </div>

                <div className="flex flex-col items-start">
                  <label className="flex justify-between w-full mb-1 text-sm text-gray-500 font-small">
                    Last Name
                    {formErrors.lastName && (
                      <span className="!mt-1 text-sm text-red-500">
                        {formErrors.lastName}
                      </span>
                    )}
                  </label>
                  <input
                    value={lastName ?? ""}
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
                    type="text"
                    placeholder="Type for hints..."
                    onChange={(e) => {
                      setLastName(e.target.value);
                      setFormErrors((prev) => ({
                        ...prev,
                        lastName: undefined,
                      }));
                    }}
                  />
                </div>

                <div className="flex flex-col items-start">
                  <label className="w-full mb-1 text-sm text-gray-500 font-small">
                    Employee Id
                  </label>
                  <input
                    value={`#${empId.slice(0, 8)}`}
                    readOnly
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
                    value={email ?? ""}
                    onChange={(e) => setEmail(e.target.value || null)}
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
                    value={phoneNumber ?? ""}
                    onChange={(e) => setPhoneNumber(e.target.value || null)}
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
                    value={address ?? ""}
                    onChange={(e) => setAddress(e.target.value || null)}
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
                    type="text"
                    placeholder="Type for hints..."
                  />
                </div>

                <div className="flex flex-col items-start">
                  <label className="w-full mb-1 text-sm text-gray-500 font-small">
                    Date Of Birth
                  </label>
                  <DatePicker
                    value={dateOfBirth}
                    onChange={(date) => setDateOfBirth(date)}
                    className="w-full px-3 py-1 text-sm bg-white border border-gray-200 rounded-md focus:outline-none focus:ring focus:ring-blue-400 custom-select"
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
                    allowClear
                  >
                    <Option value="Male">Male</Option>
                    <Option value="Female">Female</Option>
                  </Select>
                </div>

                <div>
                  <label className="w-full text-sm text-gray-500 font-small">
                    Nationality
                  </label>
                  <Select
                    value={nationality}
                    onChange={(value) => setNationality(value)}
                    className="w-full !mt-1"
                    placeholder="--Select--"
                    allowClear
                  >
                    <Option value="VietNam">VietNam</Option>
                    <Option value="China">China</Option>
                  </Select>
                </div>

                <div>
                  <label className="flex justify-between w-full mb-1 text-sm text-gray-500 font-small">
                    Employee Status
                    {formErrors.employeeStatusId && (
                      <span className="!mt-1 text-sm text-red-500">
                        {formErrors.employeeStatusId}
                      </span>
                    )}
                  </label>
                  <Select
                    value={employeeStatusId}
                    className="w-full"
                    placeholder="--Select--"
                    allowClear
                    onChange={(value) => {
                      setEmployeeStatusId(value);
                      setFormErrors((prev) => ({
                        ...prev,
                        employeeStatusId: undefined,
                      }));
                    }}
                  >
                    {employeeStatuses.map((status) => (
                      <Option key={status.id} value={status.id}>
                        {status.name}
                      </Option>
                    ))}
                  </Select>
                </div>
                <div>
                  <label className="flex justify-between w-full mb-1 text-sm text-gray-500 font-small">
                    Sub Unit
                    {formErrors.subUnitId && (
                      <span className="!mt-1 text-sm text-red-500">
                        {formErrors.subUnitId}
                      </span>
                    )}
                  </label>
                  <Select
                    value={subUnitId}
                    className="w-full"
                    placeholder="--Select--"
                    allowClear
                    onChange={(value) => {
                      setSubUnitId(value);
                      setFormErrors((prev) => ({
                        ...prev,
                        subUnitId: undefined,
                      }));
                    }}
                  >
                    {subUnits.map((sub) => (
                      <Option key={sub.id} value={sub.id}>
                        {sub.name}
                      </Option>
                    ))}
                  </Select>
                </div>
                <div>
                  <label className="flex justify-between w-full mb-1 text-sm text-gray-500 font-small">
                    Employee Job
                    {formErrors.jobTitleId && (
                      <span className="!mt-1 text-sm text-red-500">
                        {formErrors.jobTitleId}
                      </span>
                    )}
                  </label>
                  <Select
                    value={jobTitleId}
                    className="w-full"
                    placeholder="--Select--"
                    allowClear
                    onChange={(value) => {
                      setJobTitleId(value);
                      setFormErrors((prev) => ({
                        ...prev,
                        jobTitleId: undefined,
                      }));
                    }}
                  >
                    {jobTitles.map((job) => (
                      <Option key={job.id} value={job.id}>
                        {job.name}
                      </Option>
                    ))}
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
