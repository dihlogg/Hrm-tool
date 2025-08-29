"use client";

import { useAuthContext } from "@/contexts/authContext";
import { useGetEmployeeDetailsByUserId } from "@/hooks/employees/useGetEmployeeDetailsByUserId";
import { useGetLeaveRequestType } from "@/hooks/leave/leave-request-types/useGetLeaveRequestTypes";
import { useGetLeaveStatus } from "@/hooks/leave/leave-statuses/useGetLeaveStatus";
import { LeaveRequestDto } from "@/hooks/leave/LeaveRequestDto";
import {
  getInitialFilters,
  LeaveRequestFilters,
} from "@/hooks/leave/LeaveRequestFilterDto";
import { useGetLeaveRequestForSupervisorId } from "@/hooks/leave/useGetLeaveRequestForSupervisorId";
import { antdSortOrderToApiOrder } from "@/utils/tableSorting";
import {
  Button,
  DatePicker,
  Descriptions,
  Modal,
  notification,
  Pagination,
  Select,
  Table,
} from "antd";
import { SelectOutlined } from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import { SortOrder } from "antd/es/table/interface";
import { useState } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { usePatchLeaveRequestStatus } from "@/hooks/leave/usePatchLeaveRequestStatus";

dayjs.extend(utc);
dayjs.extend(timezone);
const { Option } = Select;

export default function ReceiveRequestPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const [api, contextHolder] = notification.useNotification();
  const [hotReload, setHotReload] = useState(0);
  const { userId } = useAuthContext();
  const { employee, loading: loadingEmployee } = useGetEmployeeDetailsByUserId(
    userId ?? ""
  );
  const { leaveRequestTypes, error: leaveRequestTypeError } =
    useGetLeaveRequestType();
  const { leaveStatuses, error: leaveStatusError } = useGetLeaveStatus();
  const [sortBy, setSortBy] = useState<string | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<SortOrder | undefined>(undefined);

  //filter
  const [filters, setFilters] = useState<LeaveRequestFilters>(
    getInitialFilters()
  );
  const [filterDrafts, setFilterDrafts] = useState<LeaveRequestFilters>(
    getInitialFilters()
  );
  const { leaveRequests, total, loading } = useGetLeaveRequestForSupervisorId(
    employee?.id ?? "",
    currentPage,
    pageSize,
    sortBy,
    sortOrder ? antdSortOrderToApiOrder(sortOrder) : undefined,
    filters,
    hotReload
  );
  const {
    patchLeaveRequestStatus,
    loading: patchLoading,
    error: patchError,
  } = usePatchLeaveRequestStatus();

  //modal
  const [selectedLeaveRequest, setSelectedLeaveRequest] =
    useState<LeaveRequestDto | null>(null);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const handleCancel = async () => {
    if (selectedLeaveRequest?.id) {
      try {
        await patchLeaveRequestStatus(selectedLeaveRequest.id, "REJECTED");
        setIsOpenModal(false);
        setSelectedLeaveRequest(null);
        setHotReload((prev) => prev + 1);
        api.success({
          message: "Leave Request Update Successfully!",
          description: `Leave request has been reject.`,
          placement: "bottomLeft",
          duration: 3,
          pauseOnHover: true,
        });
        setIsOpenModal(false);
      } catch (err: any) {
        console.error("Failed to reject leave request:", err);
        api.error({
          message: "Update failed!",
          description: "Leave request has not been reject.",
          placement: "bottomLeft",
          duration: 3,
          pauseOnHover: true,
        });
        setIsOpenModal(false);
      }
    }
  };
  const handleOk = async () => {
    if (selectedLeaveRequest?.id) {
      try {
        await patchLeaveRequestStatus(selectedLeaveRequest.id, "APPROVED");
        setIsOpenModal(false);
        setSelectedLeaveRequest(null);
        setHotReload((prev) => prev + 1);
        api.success({
          message: "Leave Request Update Successfully!",
          description: `Leave request has been aprroved.`,
          placement: "bottomLeft",
          duration: 3,
          pauseOnHover: true,
        });
        setIsOpenModal(false);
      } catch (err: any) {
        console.error("Failed to approved leave request:", err);
        api.error({
          message: "Update failed!",
          description: "Leave request has not been aprrove.",
          placement: "bottomLeft",
          duration: 3,
          pauseOnHover: true,
        });
        setIsOpenModal(false);
      }
    }
  };

  function mapSorterFieldToApiField(
    field: string | undefined
  ): string | undefined {
    if (!field) return undefined;
    switch (field) {
      case "leaveRequestTypeId":
        return "leaveRequestType";
      case "leaveStatusId":
        return "leaveStatus";
      case "leaveReasonId":
        return "leaveReason";
      case "partialDayId":
        return "partialDay";
      default:
        return field;
    }
  }

  const columns: ColumnsType<LeaveRequestDto> = [
    {
      title: <span className="select-none">Requester</span>,
      key: "requester",
      render: (_, record) => {
        const requester = record.employee
          ? `${record.employee.firstName} ${record.employee.lastName}`
          : "N/A";
        return <span>{requester}</span>;
      },
    },
    {
      title: <span className="select-none">Request Type</span>,
      dataIndex: "leaveRequestTypeId",
      sorter: true,
      sortOrder: sortBy === "leaveRequestType" ? sortOrder : undefined,
      render: (_, record) => record.leaveRequestType?.name || "N/A",
    },
    {
      title: <span className="select-none">Time Request</span>,
      render: (_, record) => {
        const fromDate = record.fromDate
          ? dayjs(record.fromDate).tz("Asia/Bangkok").format("DD-MMM-YYYY")
          : null;
        const toDate = record.toDate
          ? dayjs(record.toDate).tz("Asia/Bangkok").format("DD-MMM-YYYY")
          : null;

        if (!fromDate && !toDate) return "N/A";
        if (fromDate === toDate) return `On ${fromDate}`;
        return `From ${fromDate} to ${toDate}`;
      },
    },
    {
      title: <span className="select-none">Partial Days</span>,
      dataIndex: "partialDayId",
      render: (_, record) => record.partialDay?.name || "N/A",
    },
    {
      title: <span className="select-none">Duration (Days)</span>,
      dataIndex: "duration",
      render: (text) => <span>{text}</span>,
    },
    {
      title: <span className="select-none">Reason</span>,
      dataIndex: "leaveReasonId",
      render: (_, record) => record.leaveReason?.name || "N/A",
    },
    {
      title: <span className="select-none">Inform To</span>,
      dataIndex: "informToId",
      render: (_, record) => {
        const informs = record.participantsRequests.filter(
          (p) => p.type === "inform"
        );
        return informs.length > 0
          ? informs
              .map((i) => `${i.employees.firstName} ${i.employees.lastName}`)
              .join(", ")
          : "N/A";
      },
    },
    {
      title: <span className="select-none">Status</span>,
      dataIndex: "leaveStatusId",
      sorter: true,
      sortOrder: sortBy === "leaveStatus" ? sortOrder : undefined,
      render: (_, record) => record.leaveStatus?.name || "N/A",
    },
    {
      title: (
        <span className="text-sm font-semibold text-gray-600 select-none">
          Actions
        </span>
      ),
      key: "actions",
      render: (_: any, record: LeaveRequestDto) => (
        <div className="flex gap-4">
          <Button
            type="default"
            shape="circle"
            className="p-2 text-gray-600 cursor-pointer hover:text-blue-800"
            onClick={() => {
              setSelectedLeaveRequest(record);
              setIsOpenModal(true);
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
            Receive Request List
          </h2>
          <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="w-full text-sm text-gray-500 font-small">
                From Date
              </label>
              <DatePicker
                className="w-full !mt-2"
                placeholder="Select date"
                format={"DD-MM-YYYY"}
                value={
                  filterDrafts.fromDate ? dayjs(filterDrafts.fromDate) : null
                }
                onChange={(from) =>
                  setFilterDrafts((prev) => ({
                    ...prev,
                    fromDate: from ? from.toDate() : undefined,
                  }))
                }
              />
            </div>
            <div>
              <label className="w-full text-sm text-gray-500 font-small">
                To Date
              </label>
              <DatePicker
                className="w-full !mt-2"
                placeholder="Select date"
                format={"DD-MM-YYYY"}
                value={filterDrafts.toDate ? dayjs(filterDrafts.toDate) : null}
                onChange={(to) =>
                  setFilterDrafts((prev) => ({
                    ...prev,
                    toDate: to ? to.toDate() : undefined,
                  }))
                }
              />
            </div>
            <div>
              <label className="w-full text-sm text-gray-500 font-small">
                Request Status
              </label>
              <Select
                className="w-full !mt-2 custom-select"
                placeholder="--Select--"
                allowClear
                value={filterDrafts.leaveStatusId || null}
                onChange={(value) =>
                  setFilterDrafts((prev) => ({
                    ...prev,
                    leaveStatusId: value,
                  }))
                }
              >
                {leaveStatuses.map((status) => (
                  <Option key={status.id} value={status.id}>
                    {status.name}
                  </Option>
                ))}
              </Select>
              {leaveStatusError && (
                <p className="mt-1 text-sm text-red-500">{leaveStatusError}</p>
              )}
            </div>
            <div>
              <label className="w-full text-sm text-gray-500 font-small">
                Request Type
              </label>
              <Select
                className="w-full !mt-2 custom-select"
                placeholder="--Select--"
                allowClear
                value={filterDrafts.leaveRequestTypeId || null}
                onChange={(value) =>
                  setFilterDrafts((prev) => ({
                    ...prev,
                    leaveRequestTypeId: value,
                  }))
                }
              >
                {leaveRequestTypes.map((type) => (
                  <Option key={type.id} value={type.id}>
                    {type.name}
                  </Option>
                ))}
              </Select>
              {leaveRequestTypeError && (
                <p className="mt-1 text-sm text-red-500">
                  {leaveRequestTypeError}
                </p>
              )}
            </div>
            <div>
              <label className="w-full text-sm text-gray-500 font-small">
                Requester
              </label>
              <Select defaultValue="--Select--" className="w-full !mt-2">
                <Option value="--Select--">--Select--</Option>
                <Option value="Annual">RequesterA</Option>
                <Option value="Sick">RequesterB</Option>
              </Select>
            </div>
            <div>
              <label className="w-full text-sm text-gray-500 font-small">
                Supervisor
              </label>
              <Select defaultValue="--Select--" className="w-full !mt-2">
                <Option value="--Select--">--Select--</Option>
                <Option value="Annual">SupervisorA</Option>
                <Option value="Sick">SupervisorB</Option>
              </Select>
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
              List Requests
            </h2>
            <a className="text-sm text-blue-600 cursor-pointer hover:underline">
              View All
            </a>
          </div>
          <Table
            columns={columns}
            dataSource={leaveRequests}
            pagination={false}
            rowKey="id"
            loading={loading}
            scroll={{ x: "max-content" }}
            className="cursor-pointer"
            // onRow handler => handle event click row data
            onRow={(record) => ({
              onClick: () => {
                setSelectedLeaveRequest(record);
                setIsOpenModal(true);
              },
              className: "hover:bg-gray-50",
            })}
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
          title="Leave Request Details:"
          open={isOpenModal}
          onCancel={() => setIsOpenModal(false)}
          cancelText="Reject"
          cancelButtonProps={{
            style: {
              backgroundColor: "#ef5350",
              color: "white",
              borderColor: "#ef5350",
            },
            className: "hover:!bg-red-400 hover:!border-red-400",
          }}
          onOk={handleOk}
          okText="Approve"
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
          {selectedLeaveRequest && (
            <Descriptions column={1} size="small" bordered>
              <Descriptions.Item label="Leave Request ID">
                {selectedLeaveRequest?.id
                  ? `#${selectedLeaveRequest.id.slice(0, 8)}`
                  : "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Requester">
                {selectedLeaveRequest.employee
                  ? `${selectedLeaveRequest.employee.firstName} ${selectedLeaveRequest.employee.lastName}`
                  : "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Request Type">
                {selectedLeaveRequest.leaveRequestType?.name || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Approved By">
                {selectedLeaveRequest.participantsRequests
                  .filter((p) => p.type === "approve")
                  .map(
                    (a) => `${a.employees.firstName} ${a.employees.lastName}`
                  )
                  .join(", ") || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Inform To">
                {selectedLeaveRequest.participantsRequests
                  .filter((p) => p.type === "inform")
                  .map(
                    (i) => `${i.employees.firstName} ${i.employees.lastName}`
                  )
                  .join(", ") || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Duration (Days)">
                {selectedLeaveRequest.duration || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Partial Day">
                {selectedLeaveRequest.partialDay?.name || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="From Date">
                {selectedLeaveRequest.fromDate
                  ? dayjs(selectedLeaveRequest.fromDate)
                      .tz("Asia/Bangkok")
                      .format("DD-MMM-YYYY")
                  : "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="To Date">
                {selectedLeaveRequest.toDate
                  ? dayjs(selectedLeaveRequest.toDate)
                      .tz("Asia/Bangkok")
                      .format("DD-MMM-YYYY")
                  : "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                {selectedLeaveRequest.leaveStatus?.name || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Reason">
                {selectedLeaveRequest.leaveReason?.name || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Reason Details">
                {selectedLeaveRequest.reasonDetails || "N/A"}
              </Descriptions.Item>
            </Descriptions>
          )}
        </Modal>
      </div>
    </>
  );
}
