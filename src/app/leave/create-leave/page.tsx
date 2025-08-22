"use client";

import { useAuthContext } from "@/contexts/authContext";
import { useGetEmployeeDetailsByUserId } from "@/hooks/employees/useGetEmployeeDetailsByUserId";
import { CreateLeaveRequestDto } from "@/hooks/leave/CreateLeaveRequestDto";
import { useGetLeaveReason } from "@/hooks/leave/leave-reasons/useGetLeaveReason";
import { useGetLeaveRequestType } from "@/hooks/leave/leave-request-types/useGetLeaveRequestTypes";
import { useGetPartialDay } from "@/hooks/leave/partial-days/useGetPartialDay";
import { useAddLeaveRequest } from "@/hooks/leave/useAddLeaveRequest";
import { Button, DatePicker, message, notification, Select } from "antd";
import { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useGetEmployeeBySubUnit } from "@/hooks/employees/useGetEmployeeBySubUnit";
import { useGetSupervisorEmployee } from "@/hooks/employees/useGetSupervisorEmployee";

const { Option } = Select;

export default function CreateNewRequestPage() {
  const { addLeaveRequest } = useAddLeaveRequest();
  const { leaveReasons } = useGetLeaveReason();
  const { leaveRequestTypes } = useGetLeaveRequestType();
  const { partialDays } = useGetPartialDay();
  const { userId } = useAuthContext();
  const { employee, loading: loadingEmployee } = useGetEmployeeDetailsByUserId(
    userId ?? ""
  );
  const searchParams = useSearchParams();
  const empId = searchParams.get("id") || undefined;
  const subId = searchParams.get("subUnitId") || undefined;

  const [api, contextHolder] = notification.useNotification();
  const [employeeId, setEmployeeId] = useState(empId || "");
  const [subUnitId, setSubUnitId] = useState(subId || "");
  const { subUnitEmployees } = useGetEmployeeBySubUnit(subUnitId, employeeId);
  const { supervisorEmployee } = useGetSupervisorEmployee(employeeId);
  const [fromDate, setFromDate] = useState<Dayjs | null>(null);
  const [toDate, setToDate] = useState<Dayjs | null>(null);
  const [duration, setDuration] = useState<string | null>(null);
  const [reasonDetails, setReasonDetails] = useState("");
  const [leaveReasonId, setLeaveReasonId] = useState<string | undefined>(
    undefined
  );
  const [leaveRequestTypeId, setLeaveRequestTypeId] = useState<
    string | undefined
  >(undefined);
  const [partialDayId, setPartialDayId] = useState<string | undefined>(
    undefined
  );
  const [approverId, setApproverId] = useState<string | undefined>(undefined);
  const [informToId, setInformToId] = useState<string | undefined>(undefined);

  const [formErrors, setFormErrors] = useState<{
    fromDate?: string;
    toDate?: string;
    duration?: string;
    reasonDetails?: string;
    leaveReasonId?: string;
    leaveRequestTypeId?: string;
    partialDayId?: string;
    approverId?: string;
    informToId?: string;
  }>({});

  useEffect(() => {
    if (fromDate && toDate) {
      if (fromDate.isSame(toDate, "day")) {
        const diffHours = toDate.diff(fromDate, "minute") / 60;
        const rounded = Math.round(diffHours * 100) / 100;
        setDuration(`${rounded} hours on ${fromDate.format("DD-MM-YYYY")}`);
      } else {
        setDuration(
          `from ${fromDate.format("DD-MM-YYYY")} to ${toDate.format(
            "DD-MM-YYYY"
          )}`
        );
      }
    } else {
      setDuration(null);
    }
  }, [fromDate, toDate]);

  useEffect(() => {
    if (employee) {
      setEmployeeId(employee.id ?? "");
      setSubUnitId(employee.subUnitId ?? "");
    }
  }, [employee]);

  const resetForm = () => {
    setFromDate(null);
    setToDate(null);
    setDuration("");
    setReasonDetails("");
    setLeaveReasonId(undefined);
    setLeaveRequestTypeId(undefined);
    setPartialDayId(undefined);
    setApproverId(undefined);
    setInformToId(undefined);
  };

  const handleSubmit = async () => {
    const errors: typeof formErrors = {};

    if (!fromDate?.toISOString()) errors.fromDate = "Required";
    if (!toDate?.toISOString()) errors.toDate = "Required";
    if (!leaveReasonId) errors.leaveReasonId = "Required";
    if (!leaveRequestTypeId) errors.leaveRequestTypeId = "Required";
    if (!partialDayId) errors.partialDayId = "Required";
    if (!approverId) errors.approverId = "Required";
    if (!informToId) errors.informToId = "Required";
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      message.warning("Please fill in all required fields before submitting!");
      setFormErrors(errors);
      return;
    }

    try {
      const payload: CreateLeaveRequestDto = {
        employeeId: employee?.id,
        fromDate: fromDate?.toISOString() ?? null,
        toDate: toDate?.toISOString() ?? null,
        duration,
        reasonDetails,
        leaveReasonId,
        leaveRequestTypeId,
        partialDayId,
        approverId,
        informToId,
      };
      await addLeaveRequest(payload);
      console.log("Leave Request created successfully!");
      api.success({
        message: "Leave Request created successfully!",
        description: `Leave Request has been added.`,
        placement: "bottomLeft",
      });
      resetForm();
    } catch (err: any) {
      api.error({
        message: "Leave Request created failed!",
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
          <h2 className="pb-2 text-xl font-semibold text-gray-500 border-b border-b-gray-400">
            Create New Request
          </h2>
          <a className="inline-block mb-4 text-sm text-blue-600 hover:underline">
            Time Off (Leave) Requests and Balances
          </a>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Request Type */}
            <div className="flex flex-col items-start gap-2 mb-4 sm:flex-row sm:items-baseline">
              <label className="w-full text-sm text-gray-500 font-small sm:w-24 shrink-0">
                Request Type*:
              </label>
              <div className="flex flex-col w-full">
                <Select
                  className="w-full"
                  placeholder="--Select--"
                  allowClear
                  value={leaveRequestTypeId}
                  onChange={(value) => {
                    setLeaveRequestTypeId(value);
                    setFormErrors((prev) => ({
                      ...prev,
                      leaveRequestTypeId: undefined,
                    }));
                  }}
                >
                  {leaveRequestTypes.map((type) => (
                    <Option key={type.id} value={type.id}>
                      {type.name}
                    </Option>
                  ))}
                </Select>
                {formErrors.leaveRequestTypeId && (
                  <span className="mt-1 text-sm font-medium text-red-500">
                    {formErrors.leaveRequestTypeId}
                  </span>
                )}
              </div>
            </div>

            {/* Approver */}
            <div className="flex flex-col items-start gap-2 mb-4 sm:flex-row sm:items-baseline">
              <label className="w-full text-sm text-gray-500 font-small sm:w-24 shrink-0">
                Approver*:
              </label>
              <div className="flex flex-col w-full">
                <Select
                  placeholder="--Select--"
                  className="w-full"
                  allowClear
                  value={approverId}
                  onChange={(value) => {
                    setApproverId(value);
                    setFormErrors((prev) => ({
                      ...prev,
                      approverId: undefined,
                    }));
                  }}
                >
                  {supervisorEmployee?.map((approve) => (
                    <Option key={approve.id} value={approve.id}>
                      {approve.firstName} {approve.lastName}
                    </Option>
                  ))}
                </Select>
                {formErrors.approverId && (
                  <span className="mt-1 text-sm font-medium text-red-500">
                    {formErrors.approverId}
                  </span>
                )}
              </div>
            </div>

            {/* From Date */}
            <div className="flex flex-col items-start gap-2 mb-4 sm:flex-row sm:items-baseline">
              <label className="w-full text-sm text-gray-500 sm:w-24 shrink-0">
                From Date:
              </label>
              <div className="flex flex-col w-full">
                <DatePicker
                  showTime={{ format: "HH:mm" }}
                  format="DD-MM-YYYY HH:mm"
                  className="w-full"
                  placeholder="Select date"
                  value={fromDate}
                  onChange={(from) => {
                    setFromDate(from);
                    setFormErrors((prev) => ({ ...prev, fromDate: undefined }));
                  }}
                />
                {formErrors.fromDate && (
                  <span className="mt-1 text-sm font-medium text-red-500">
                    {formErrors.fromDate}
                  </span>
                )}
              </div>
            </div>

            {/* To Date */}
            <div className="flex flex-col items-start gap-2 mb-4 sm:flex-row sm:items-baseline">
              <label className="w-full text-sm text-gray-500 sm:w-24 shrink-0">
                To Date:
              </label>
              <div className="flex flex-col w-full">
                <DatePicker
                  showTime={{ format: "HH:mm" }}
                  format="DD-MM-YYYY HH:mm"
                  className="w-full"
                  placeholder="Select date"
                  value={toDate}
                  disabledDate={(current) => {
                    return fromDate ? current.isBefore(fromDate, "day") : false;
                  }}
                  disabledTime={(date) => {
                    if (!fromDate || !date) return {};
                    if (date.isSame(fromDate, "day")) {
                      return {
                        disabledHours: () =>
                          Array.from(
                            { length: fromDate.hour() + 1 },
                            (_, i) => i
                          ),
                        disabledMinutes: (selectedHour) =>
                          selectedHour === fromDate.hour()
                            ? Array.from(
                                { length: fromDate.minute() + 1 },
                                (_, i) => i
                              )
                            : [],
                      };
                    }
                    return {};
                  }}
                  onChange={(to) => {
                    setToDate(to);
                    setFormErrors((prev) => ({ ...prev, toDate: undefined }));
                  }}
                />
                {formErrors.toDate && (
                  <span className="mt-1 text-sm font-medium text-red-500">
                    {formErrors.toDate}
                  </span>
                )}
              </div>
            </div>

            {/* Duration */}
            <div className="flex flex-col items-start gap-2 mb-4 sm:flex-row sm:items-baseline">
              <label className="w-full text-sm text-gray-500 sm:w-24 shrink-0">
                Duration:
              </label>
              <div className="flex flex-col w-full">
                <input
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md bg-gray-50 focus:outline-none"
                  type="text"
                  value={duration ?? ""}
                  readOnly
                  placeholder="Duration will be calculated"
                />
              </div>
            </div>

            {/* Partial Days */}
            <div className="flex flex-col items-start gap-2 mb-4 sm:flex-row sm:items-baseline">
              <label className="w-full text-sm text-gray-500 font-small sm:w-24 shrink-0">
                Partial Days*:
              </label>
              <div className="flex flex-col w-full">
                <Select
                  className="w-full"
                  placeholder="--Select"
                  allowClear
                  value={partialDayId}
                  onChange={(value) => {
                    setPartialDayId(value);
                    setFormErrors((prev) => ({
                      ...prev,
                      partialDayId: undefined,
                    }));
                  }}
                >
                  {partialDays.map((partial) => (
                    <Option key={partial.id} value={partial.id}>
                      {partial.name}
                    </Option>
                  ))}
                </Select>
                {formErrors.partialDayId && (
                  <span className="mt-1 text-sm font-medium text-red-500">
                    {formErrors.partialDayId}
                  </span>
                )}
              </div>
            </div>

            {/* Reason */}
            <div className="flex flex-col items-start gap-2 mb-4 sm:flex-row sm:items-baseline">
              <label className="w-full text-sm text-gray-500 font-small sm:w-24 shrink-0">
                Reason*:
              </label>
              <div className="flex flex-col w-full">
                <Select
                  className="w-full"
                  placeholder="--Select"
                  allowClear
                  value={leaveReasonId}
                  onChange={(value) => {
                    setLeaveReasonId(value);
                    setFormErrors((prev) => ({
                      ...prev,
                      leaveReasonId: undefined,
                    }));
                  }}
                >
                  {leaveReasons.map((reason) => (
                    <Option key={reason.id} value={reason.id}>
                      {reason.name}
                    </Option>
                  ))}
                </Select>
                {formErrors.leaveReasonId && (
                  <span className="mt-1 text-sm font-medium text-red-500">
                    {formErrors.leaveReasonId}
                  </span>
                )}
              </div>
            </div>

            {/* Inform To */}
            <div className="flex flex-col items-start gap-2 mb-4 sm:flex-row sm:items-baseline">
              <label className="w-full text-sm text-gray-500 font-small sm:w-24 shrink-0">
                Inform To:
              </label>
              <div className="flex flex-col w-full">
                <Select
                  placeholder="--Select--"
                  className="w-full"
                  allowClear
                  value={informToId}
                  onChange={(value) => {
                    setInformToId(value);
                    setFormErrors((prev) => ({
                      ...prev,
                      informToId: undefined,
                    }));
                  }}
                >
                  {subUnitEmployees?.map((inform) => (
                    <Option key={inform.id} value={inform.id}>
                      {inform.firstName} {inform.lastName}
                    </Option>
                  ))}
                </Select>
                {formErrors.informToId && (
                  <span className="mt-1 text-sm font-medium text-red-500">
                    {formErrors.informToId}
                  </span>
                )}
              </div>
            </div>

            {/* Reason Details */}
            <div className="sm:col-span-2">
              <label className="w-full text-sm text-gray-500 font-small sm:w-24 shrink-0">
                Reason Details:
              </label>
              <div className="flex flex-col w-full">
                <textarea
                  id="message"
                  rows={4}
                  value={reasonDetails}
                  onChange={(e) => {
                    setReasonDetails(e.target.value);
                    setFormErrors((prev) => ({
                      ...prev,
                      reasonDetails: undefined,
                    }));
                  }}
                  className="w-full px-3 py-2 !mt-2 text-sm text-gray-900 bg-white border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
                  placeholder="Write your reason details here..."
                ></textarea>
                {formErrors.reasonDetails && (
                  <span className="mt-1 text-sm font-medium text-red-500">
                    {formErrors.reasonDetails}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-between mt-6">
            <span className="text-sm italic font-medium text-gray-500">
              * Required
            </span>
            <div className="flex justify-end gap-3">
              <Button
                type="primary"
                shape="round"
                size="middle"
                ghost
                className="text-blue-500 border-blue-500 hover:bg-blue-50"
              >
                Cancel
              </Button>
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
    </>
  );
}
