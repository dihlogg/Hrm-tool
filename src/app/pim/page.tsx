"use client";

import { useJobTitles } from "@/hooks/employees/job-titles/useJobTitles";
import { useSubUnits } from "@/hooks/employees/sub-units/useSubUnits";
import {
  Button,
  Modal,
  Pagination,
  Select,
  Table,
  Descriptions,
  notification,
  Popover,
  message,
} from "antd";
import { useState } from "react";
import {
  EditOutlined,
  CloudUploadOutlined,
  SelectOutlined,
  DeleteOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { CreateEmployeeDto } from "@/hooks/employees/CreateEmployeeDto";
import type { ColumnsType, SortOrder } from "antd/es/table/interface";
import { useEmployees } from "@/hooks/employees/useEmployees";
import { useGetEmployeeStatus } from "@/hooks/employees/employee-statuses/useGetEmployeeStatus";
import { antdSortOrderToApiOrder } from "@/utils/tableSorting";
import {
  EmployeeFilters,
  getInitialFilters,
} from "@/hooks/employees/EmployeeFiltersDto";
import { usePatchEmployeeStatus } from "@/hooks/employees/usePatchEmployeeStatus";
import { useCreateUserAccount } from "@/hooks/employees/useCreateUserAccount";
import { useUserStatuses } from "@/hooks/users/user-statuses/useUserStatuses";
import { exportPDF } from "@/utils/exportPDF";
import { API_ENDPOINTS } from "@/services/apiService";
import axiosInstance from "@/utils/auth/axiosInstance";
import { exportExcel } from "@/utils/exportExcel";

const { Option } = Select;

export default function EmployeeListPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const [api, contextHolder] = notification.useNotification();
  const [hotReload, setHotReload] = useState(0);
  const [sortBy, setSortBy] = useState<string | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<SortOrder | undefined>(undefined);

  const { jobTitles, error: jobTitleError } = useJobTitles();
  const { subUnits, error: subUnitError } = useSubUnits();
  const { employeeStatuses, error: employeeStatusError } =
    useGetEmployeeStatus();
  const { updateEmployeeStatus } = usePatchEmployeeStatus();
  const { userStatuses, error: userStatusError } = useUserStatuses();
  const { createUserAccount, loading: creatingAccount } = useCreateUserAccount();

  // Create User Account States
  const [isCreateAccountModalOpen, setIsCreateAccountModalOpen] = useState(false);
  const [selectedEmployeeForAccount, setSelectedEmployeeForAccount] = useState<CreateEmployeeDto | null>(null);
  const [username, setUsername] = useState("");
  const [userStatus, setUserStatus] = useState<"Active" | "Inactive">("Active");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ confirmPassword?: string }>({});
  const [accountFormErrors, setAccountFormErrors] = useState<{
    userName?: string;
    password?: string;
  }>({});

  //filter
  const [filters, setFilters] = useState<EmployeeFilters>(getInitialFilters());
  const [filterDrafts, setFilterDrafts] =
    useState<EmployeeFilters>(getInitialFilters());

  const { employees, total, loading } = useEmployees(
    currentPage,
    pageSize,
    sortBy,
    sortOrder ? antdSortOrderToApiOrder(sortOrder) : undefined,
    filters,
    hotReload,
  );

  //modal
  const [selectedEmployee, setSelectedEmployee] =
    useState<CreateEmployeeDto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleCreateAccountCancel = () => {
    setIsCreateAccountModalOpen(false);
    setSelectedEmployeeForAccount(null);
    setUsername("");
    setPassword("");
    setConfirmPassword("");
    setUserStatus("Active");
    setFieldErrors({});
    setAccountFormErrors({});
  };

  const handleCreateAccountSubmit = async () => {
    const selectedStatus = userStatuses.find((s) => s.name === userStatus);
    const errors: typeof accountFormErrors = {};

    if (!username.trim()) errors.userName = "*Required";
    if (!password.trim()) errors.password = "*Required";

    setAccountFormErrors(errors);

    if (Object.keys(errors).length > 0 || fieldErrors.confirmPassword) {
      message.warning("Please fill in all required fields correctly!");
      return;
    }

    if (selectedEmployeeForAccount?.id) {
      try {
        await createUserAccount(selectedEmployeeForAccount.id, {
          userName: username,
          password,
          userStatusId: selectedStatus?.id ?? "",
        });
        api.success({
          message: "User Account Created!",
          description: `Account created for ${selectedEmployeeForAccount.firstName} ${selectedEmployeeForAccount.lastName}.`,
          placement: "bottomLeft",
        });
        handleCreateAccountCancel();
        setHotReload((prev) => prev + 1); // Refresh list
      } catch (err: unknown) {
        api.error({
          message: "Account Creation Failed!",
          description: err instanceof Error ? err.message : "Unknown error",
          placement: "bottomLeft",
        });
      }
    }
  };

  const [isOpenModalChangeStatus, setIsOpenModalChangeStatus] = useState(false);

  const handleOkChangeStatus = async () => {
    if (selectedEmployee?.id) {
      try {
        await updateEmployeeStatus(selectedEmployee.id);
        setIsOpenModalChangeStatus(false);
        setSelectedEmployee(null);
        setHotReload((prev) => prev + 1);
        api.success({
          message: "Employee Update Successfully!",
          description: `Employee information has been updated.`,
          placement: "bottomLeft",
          duration: 3,
          pauseOnHover: true,
        });
        setIsOpenModalChangeStatus(false);
      } catch (err: unknown) {
        let errorMessage = "An unknown error occurred.";
        if (err instanceof Error) {
          errorMessage = err.message;
        }
        console.error("Failed to update employee status:", err);
        api.error({
          message: "Update failed!",
          description: errorMessage,
          placement: "bottomLeft",
          duration: 3,
          pauseOnHover: true,
        });
        setIsOpenModalChangeStatus(false);
      }
    }
  };
  const router = useRouter();

  function mapSorterFieldToApiField(
    field: string | undefined,
  ): string | undefined {
    if (!field) return undefined;
    switch (field) {
      case "jobTitleId":
        return "jobTitle";
      case "employeeStatusId":
        return "employeeStatus";
      case "subUnitId":
        return "subUnit";
      default:
        return field;
    }
  }

  const handleExportPDF = async () => {
    try {
      const response = await axiosInstance.get(
        API_ENDPOINTS.GET_EMPLOYEE_LIST,
        {
          params: { page: 1, pageSize: total },
        },
      );

      const allEmployees = response.data.data;

      exportPDF(columns, allEmployees, "Employee_List.pdf", "Employee List");
    } catch (err) {
      console.error("Export failed:", err);
    }
  };

  const handleExportExcel = async () => {
    try {
      const response = await axiosInstance.get(
        API_ENDPOINTS.GET_EMPLOYEE_LIST,
        {
          params: { page: 1, pageSize: total },
        },
      );
      const allEmployees = response.data.data;
      exportExcel(columns, allEmployees, "Employee_List.xlsx", "Employee List");
    } catch (err) {
      console.error("Export Excel failed:", err);
    }
  };
  const content = (
    <div className="flex flex-col space-y-2">
      <Button
        type="text"
        className="hover:!text-blue-500 transition-colors"
        onClick={handleExportPDF}
      >
        Export PDF
      </Button>
      <Button
        type="text"
        className="hover:!text-blue-500 transition-colors"
        onClick={handleExportExcel}
      >
        Export Excel
      </Button>
    </div>
  );

  const columns: ColumnsType<CreateEmployeeDto> = [
    {
      title: <span className="select-none">First Name</span>,
      dataIndex: "firstName",
      sorter: true,
      sortOrder: sortBy === "firstName" ? sortOrder : undefined,
      render: (text) => <span>{text}</span>,
    },
    {
      title: <span className="select-none">Last Name</span>,
      dataIndex: "lastName",
      sorter: true,
      sortOrder: sortBy === "lastName" ? sortOrder : undefined,
      render: (text) => <span>{text}</span>,
    },
    {
      title: <span className="select-none">Job Title</span>,
      dataIndex: "jobTitleId",
      sorter: true,
      sortOrder: sortBy === "jobTitle" ? sortOrder : undefined,
      render: (_, record) => record.jobTitle?.name || "N/A",
    },
    {
      title: <span className="select-none">Sub Unit</span>,
      dataIndex: "subUnitId",
      sorter: true,
      sortOrder: sortBy === "subUnit" ? sortOrder : undefined,
      render: (_, record) => record.subUnit?.name || "N/A",
    },
    {
      title: <span className="select-none">Employee Status</span>,
      dataIndex: "employeeStatusId",
      sorter: true,
      sortOrder: sortBy === "employeeStatus" ? sortOrder : undefined,
      render: (_, record) => record.employeeStatus?.name || "N/A",
    },
    {
      title: (
        <span className="text-sm font-semibold text-gray-600 select-none">
          Actions
        </span>
      ),
      key: "actions",
      render: (_: unknown, record: CreateEmployeeDto) => (
        <div className="flex gap-4">
          <Button
            type="default"
            shape="circle"
            onClick={() => router.push(`/pim/edit-employee?id=${record.id}`)}
            className="p-2 text-gray-600 cursor-pointer hover:text-blue-800"
          >
            <EditOutlined style={{ fontSize: "16px", color: "#6B7280" }} />
          </Button>
          <Button
            type="default"
            shape="circle"
            className="p-2 text-gray-600 cursor-pointer hover:text-blue-800"
            onClick={() => {
              setSelectedEmployee(record);
              console.log(record);
              setIsOpenModalChangeStatus(true);
            }}
          >
            <DeleteOutlined style={{ fontSize: "16px", color: "#6B7280" }} />
          </Button>
          <Button
            type="default"
            shape="circle"
            className="p-2 text-gray-600 cursor-pointer hover:text-blue-800"
            onClick={() => {
              setSelectedEmployee(record);
              setIsModalOpen(true);
            }}
          >
            <SelectOutlined style={{ fontSize: "16px", color: "#6B7280" }} />
          </Button>
          {!record.userId && (
            <Button
              type="default"
              shape="circle"
              className="p-2 text-gray-600 cursor-pointer hover:text-green-600 border-green-200"
              onClick={() => {
                setSelectedEmployeeForAccount(record);
                setIsCreateAccountModalOpen(true);
              }}
              title="Create User Account"
            >
              <UserAddOutlined style={{ fontSize: "16px", color: "#16a34a" }} />
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      {contextHolder}
      <div className="flex-1 w-full p-4 mt-2 space-y-6">
        {/* Filter Section */}
        <div className="flex-col px-8 py-4 bg-white border-gray-200 rounded-lg shadow-sm sm:flex-row">
          <h2 className="pb-2 text-xl font-semibold text-gray-500 border-b border-b-gray-400">
            Employee Information
          </h2>
          <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col items-start">
              <label className="w-full mb-2 text-sm text-gray-500 font-small">
                First Name
              </label>
              <input
                className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
                type="text"
                placeholder="Type for hints..."
                value={filterDrafts.firstName}
                onChange={(e) =>
                  setFilterDrafts((prev) => ({
                    ...prev,
                    firstName: e.target.value,
                  }))
                }
              />
            </div>

            <div className="flex flex-col items-start">
              <label className="w-full mb-2 text-sm text-gray-500 font-small">
                Last Name
              </label>
              <input
                className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
                type="text"
                placeholder="Type for hints..."
                value={filterDrafts.lastName}
                onChange={(e) =>
                  setFilterDrafts((prev) => ({
                    ...prev,
                    lastName: e.target.value,
                  }))
                }
              />
            </div>

            <div className="flex flex-col items-start">
              <label className="w-full mb-2 text-sm text-gray-500 font-small">
                Employee Id
              </label>
              <input
                className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
                type="text"
                placeholder="Type for hints..."
                value={filterDrafts.employeeId}
                onChange={(e) =>
                  setFilterDrafts((prev) => ({
                    ...prev,
                    employeeId: e.target.value,
                  }))
                }
              />
            </div>

            <div>
              <label className="w-full text-sm text-gray-500 font-small">
                Employee Status
              </label>
              <Select
                className="w-full !mt-2 custom-select"
                placeholder="--Select--"
                allowClear
                value={filterDrafts.employeeStatusId || null}
                onChange={(value) =>
                  setFilterDrafts((prev) => ({
                    ...prev,
                    employeeStatusId: value,
                  }))
                }
              >
                {employeeStatuses.map((status) => (
                  <Option key={status.id} value={status.id}>
                    {status.name}
                  </Option>
                ))}
              </Select>
              {employeeStatusError && (
                <p className="mt-1 text-sm text-red-500">
                  {employeeStatusError}
                </p>
              )}
            </div>

            <div>
              <label className="w-full text-sm text-gray-500 font-small">
                Job Title
              </label>
              <Select
                className="w-full !mt-2 custom-select"
                placeholder="--Select--"
                allowClear
                value={filterDrafts.jobTitleId || null}
                onChange={(value) =>
                  setFilterDrafts((prev) => ({ ...prev, jobTitleId: value }))
                }
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
              <label className="w-full text-sm text-gray-500 font-small">
                Sub Unit
              </label>
              <Select
                className="w-full !mt-2 custom-select"
                placeholder="--Select--"
                allowClear
                value={filterDrafts.subUnitId || null}
                onChange={(value) =>
                  setFilterDrafts((prev) => ({ ...prev, subUnitId: value }))
                }
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
          </div>
          <div className="grid justify-end grid-flow-col gap-2 mt-4">
            <Button
              type="primary"
              shape="round"
              size="middle"
              ghost
              className="text-blue-500"
              onClick={() => {
                const initial = getInitialFilters();
                setFilterDrafts(initial);
                setSortOrder(undefined);
                setFilters(initial);
              }}
            >
              Reset
            </Button>
            <Button
              type="primary"
              shape="round"
              size="middle"
              className="text-white bg-blue-500 hover:bg-blue-600"
              onClick={() => {
                setFilters(filterDrafts);
                setCurrentPage(1);
              }}
            >
              + Apply
            </Button>
          </div>
        </div>

        {/* Table Section */}
        <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-500">
              ({total ?? 0}) Records Found
            </h2>
            <Popover content={content} color="#fff" trigger="click">
              <Button
                type="default"
                shape="round"
                icon={<CloudUploadOutlined style={{ fontSize: 20 }} />}
                size="large"
                className="transition-all duration-300 !border-2 shadow-md hover:shadow-lg"
              />
            </Popover>
          </div>
          <Table
            columns={columns}
            dataSource={employees}
            pagination={false}
            rowKey="id"
            loading={loading}
            scroll={{ x: "max-content" }}
            onChange={(pagination, filters, sorter) => {
              if (!Array.isArray(sorter)) {
                const rawField =
                  typeof sorter.field === "string" ? sorter.field : undefined;
                const mappedField = mapSorterFieldToApiField(rawField);
                const order = sorter.order as SortOrder | undefined;

                if (mappedField !== sortBy || order !== sortOrder) {
                  setSortBy(mappedField);
                  setSortOrder(order);
                }
              }
            }}
          />
          <div className="flex items-center justify-end mt-4">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={total}
              onChange={(page) => setCurrentPage(page)}
              showLessItems
            />
          </div>
        </div>
        <Modal
          title="Employee Details"
          open={isModalOpen}
          onCancel={handleCancel}
          footer={null}
          closable={true}
          width={{
            xs: "90%",
            sm: "80%",
            md: "70%",
            lg: "60%",
            xl: "50%",
            xxl: "40%",
          }}
        >
          {selectedEmployee && (
            <Descriptions column={1} size="small" bordered>
              <Descriptions.Item label="First Name">
                {selectedEmployee?.firstName}
              </Descriptions.Item>
              <Descriptions.Item label="Last Name">
                {selectedEmployee?.lastName}
              </Descriptions.Item>
              <Descriptions.Item label="Employee ID">
                {selectedEmployee?.id}
              </Descriptions.Item>
              <Descriptions.Item label="Job Title">
                {selectedEmployee?.jobTitle?.name || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Sub Unit">
                {selectedEmployee?.subUnit?.name || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Employee Status">
                {selectedEmployee?.employeeStatus?.name || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {selectedEmployee?.email || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Phone">
                {selectedEmployee?.phoneNumber || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Address">
                {selectedEmployee?.address || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Nationality">
                {selectedEmployee?.nationality || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Gender">
                {selectedEmployee?.gender || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Date of Birth">
                {selectedEmployee?.dayOfBirth || "N/A"}
              </Descriptions.Item>
            </Descriptions>
          )}
        </Modal>
        <Modal
          title="Confirm Leave"
          closable={true}
          open={isOpenModalChangeStatus}
          onCancel={() => {
            setIsOpenModalChangeStatus(false);
          }}
          width={{
            xs: "90%",
            sm: "80%",
            md: "70%",
            lg: "60%",
            xl: "50%",
            xxl: "40%",
          }}
          footer={[
            <Button
              key="cancel"
              variant="filled"
              onClick={() => {
                setIsOpenModalChangeStatus(false);
              }}
            >
              Cancel
            </Button>,
            <Button
              key="delete"
              color="danger"
              variant="filled"
              onClick={() => {
                handleOkChangeStatus();
              }}
            >
              Delete
            </Button>,
          ]}
        >
          <span className="text-sm font-medium text-gray-500">
            Are you sure you want to update the leave status for employee:{" "}
            {selectedEmployee
              ? `${selectedEmployee.lastName} ${selectedEmployee.firstName}`
              : "this employee"}
          </span>
          <p className="mt-2 text-sm text-gray-500">
            This action will update their status to inactive.
          </p>
        </Modal>
        
        {/* Create User Account Modal */}
        <Modal
          title={`Create Account for ${selectedEmployeeForAccount?.firstName || ""} ${selectedEmployeeForAccount?.lastName || ""}`}
          open={isCreateAccountModalOpen}
          onCancel={handleCreateAccountCancel}
          footer={[
            <Button key="cancel" onClick={handleCreateAccountCancel} shape="round">
              Cancel
            </Button>,
            <Button
              key="submit"
              type="primary"
              loading={creatingAccount}
              onClick={handleCreateAccountSubmit}
              shape="round"
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              Save
            </Button>,
          ]}
          width={{
            xs: "90%",
            sm: "80%",
            md: "70%",
            lg: "60%",
            xl: "50%",
            xxl: "40%",
          }}
        >
          <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 bg-[#F1F5F9] mt-4 px-4 py-4 rounded-xl">
            <div className="flex flex-col items-start">
              <label className="flex justify-between w-full mb-1 text-sm text-gray-500 font-small">
                User Name
                {accountFormErrors.userName && (
                  <span className="!mt-1 text-sm text-red-500">
                    {accountFormErrors.userName}
                  </span>
                )}
              </label>
              <input
                className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
                type="text"
                placeholder="Type for hints..."
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setAccountFormErrors((prev) => ({
                    ...prev,
                    userName: undefined,
                  }));
                }}
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
                        setUserStatus(e.target.value as "Active" | "Inactive")
                      }
                      className="w-4 h-4"
                    />
                    {status.name}
                  </label>
                ))}
              </div>
              {userStatusError && (
                <p className="mt-1 text-sm text-red-500">{userStatusError}</p>
              )}
            </div>

            <div className="flex flex-col">
              <label className="flex justify-between mt-4 text-sm text-gray-500">
                Password
                {accountFormErrors.password && (
                  <span className="!mt-1 text-sm text-red-500">
                    {accountFormErrors.password}
                  </span>
                )}
              </label>
              <input
                className="w-full px-3 py-2 !mt-1 text-sm bg-white border border-gray-200 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setAccountFormErrors((prev) => ({
                    ...prev,
                    password: undefined,
                  }));
                }}
              />
              <p className="!mt-2 text-sm text-gray-500">
                For a strong password, please use a hard to guess combination
                with upper and lower case characters, symbols, and numbers
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
                      confirmPassword: "Passwords do not match !",
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
                <p className="!mt-2 text-sm text-red-500">
                  {fieldErrors.confirmPassword}
                </p>
              )}
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
}
