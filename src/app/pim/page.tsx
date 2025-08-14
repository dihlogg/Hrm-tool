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
} from "antd";
import { useState } from "react";
import {
  EditOutlined,
  CloudUploadOutlined,
  InfoOutlined,
  SelectOutlined,
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
import { exportPDF } from "@/utils/exportPDF";
import { API_ENDPOINTS } from "@/services/apiService";
import axiosInstance from "@/utils/auth/axiosInstance";

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
  const { updateEmployeeStatus, loading: updateLoading } =
    usePatchEmployeeStatus();

  //filter
  const [filters, setFilters] = useState<EmployeeFilters>(getInitialFilters());
  const [filterDrafts, setFilterDrafts] = useState<EmployeeFilters>(
    getInitialFilters()
  );

  const { employees, total, loading } = useEmployees(
    currentPage,
    pageSize,
    sortBy,
    sortOrder ? antdSortOrderToApiOrder(sortOrder) : undefined,
    filters,
    hotReload
  );

  //modal
  const [selectedEmployee, setSelectedEmployee] =
    useState<CreateEmployeeDto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const [isOpenModalChangeStatus, setIsOpenModalChangeStatus] = useState(false);
  const handleCancelModalChangeStatus = () => {
    setSelectedEmployee(null);
    setIsOpenModalChangeStatus(false);
  };

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
      } catch (err: any) {
        console.error("Failed to update employee status:", err);
        api.error({
          message: "Update failed!",
          description: "This employee is already on leave",
          placement: "bottomLeft",
          duration: 3,
          pauseOnHover: true,
        });
        setIsOpenModalChangeStatus(false);
      }
    }
  };

  const content = <span className="text-white">Click to export file</span>;
  const router = useRouter();

  function mapSorterFieldToApiField(
    field: string | undefined
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

  const handleExport = async () => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.GET_EMPLOYEE_LIST, {
        params: { page: 1, pageSize: total },
      });

      const allEmployees = response.data.data;

      exportPDF(columns, allEmployees, "Employee_List.pdf", "Employee List");
    } catch (err) {
      console.error("Export failed:", err);
    }
  };

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
      render: (_: any, record: CreateEmployeeDto) => (
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
            <InfoOutlined style={{ fontSize: "16px", color: "#6B7280" }} />
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
                setFilterDrafts(getInitialFilters());
                setSortOrder(undefined);
                setFilters(filterDrafts);
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
            <Popover content={content} color="#2e2b2b">
              <Button
                type="default"
                shape="round"
                icon={
                  <CloudUploadOutlined
                    style={{ fontSize: "20px", color: "#6B7280" }}
                  />
                }
                size="large"
                className="text-white bg-blue-500 !border-2 !border-gray-300 hover:bg-blue-600 transition"
                onClick={handleExport}
              ></Button>
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
          onCancel={handleCancelModalChangeStatus}
          onOk={handleOkChangeStatus}
          width={{
            xs: "90%",
            sm: "80%",
            md: "70%",
            lg: "60%",
            xl: "50%",
            xxl: "40%",
          }}
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
      </div>
    </>
  );
}
