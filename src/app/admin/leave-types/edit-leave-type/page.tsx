"use client";

import React, { useEffect, useState } from "react";
import { Button, message, notification } from "antd";
import { LeaveTypeDto } from "@/hooks/leave/leave-types/LeaveTypeDto";
import { useUpdateLeaveType } from "@/hooks/leave/leave-types/useUpdateLeaveType";
import { useGetLeaveTypeById } from "@/hooks/leave/leave-types/useGetLeaveTypeById";
import { useSearchParams } from "next/navigation";

export default function EditLeaveTypePage() {
  const { updateLeaveType } = useUpdateLeaveType();
  const searchParams = useSearchParams();
  const leaveTypeId = searchParams.get("id") || undefined;
  const { leaveType } = useGetLeaveTypeById(leaveTypeId ?? "");

  const [formErrors, setFormErrors] = useState<{
    name?: string;
    description?: string;
    unit?: string;
    maximumAllowed?: string;
    maxCarryOver?: string;
    expireMonth?: string;
  }>({});
  const [api, contextHolder] = notification.useNotification();
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [unit, setUnit] = useState("Days");
  const [maximumAllowed, setMaximumAllowed] = useState<number>(0);
  const [maxCarryOver, setMaxCarryOver] = useState<number>(0);
  const [expireMonth, setExpireMonth] = useState<number>(3);

  useEffect(() => {
    if (leaveType) {
      setName(leaveType.name ?? "");
      setDescription(leaveType.description ?? "");
      setUnit(leaveType.unit ?? "Days");
      setMaximumAllowed(leaveType.maximumAllowed ?? 0);
      setMaxCarryOver(leaveType.maxCarryOver ?? 0);
      setExpireMonth(leaveType.expireMonth ?? 3);
    }
  }, [leaveType]);

  const handleSubmit = async () => {
    const errors: typeof formErrors = {};

    if (!name.trim()) errors.name = "Required";
    if (!description.trim()) errors.description = "Required";
    if (!unit.trim()) errors.unit = "Required";
    if (maximumAllowed < 0) errors.maximumAllowed = "Must be positive";
    if (maxCarryOver < 0) errors.maxCarryOver = "Must be positive";
    if (expireMonth < 1 || expireMonth > 12) errors.expireMonth = "Must be between 1 and 12";

    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      message.warning("Please fill in all required fields properly before submitting!");
      return;
    }

    try {
      const payload: LeaveTypeDto = {
        id: leaveTypeId,
        name,
        description,
        unit,
        maximumAllowed: Number(maximumAllowed),
        maxCarryOver: Number(maxCarryOver),
        expireMonth: Number(expireMonth),
      };

      await updateLeaveType(leaveTypeId!, payload);
      api.success({
        message: "Leave Type Update Successfully!",
        description: `Leave Type has been updated.`,
        placement: "bottomLeft",
        duration: 3,
        pauseOnHover: true,
      });
    } catch (err: unknown) {
      let errorMessage = "An unknown error occurred.";

      if (err instanceof Error) {
        errorMessage = err.message;
      }
      api.error({
        message: "Leave Type Update failed!",
        description: errorMessage,
        placement: "bottomLeft",
        duration: 3,
        pauseOnHover: true,
      });
    }
  };

  return (
    <>
      {contextHolder}
      <div className="flex-1 w-full p-4 mt-2 space-y-6">
        <div className="flex-col px-8 py-4 bg-white border-gray-200 rounded-lg shadow-sm sm:flex-row">
          <h2 className="pb-2 text-xl font-semibold text-gray-500 border-b border-gray-400">
            Edit Leave Type
          </h2>
          <div className="flex flex-col gap-6 md:flex-row">
            <div className="flex-col w-full py-4 border-gray-200 rounded-lg sm:flex-row">
              <div className="grid grid-cols-1 gap-8 mb-6 sm:grid-cols-2 lg:grid-cols-2">
                <div className="flex flex-col items-start">
                  <label className="flex justify-between w-full pb-1 mb-1 text-sm font-medium text-gray-500 font-small">
                    Leave Type Name*
                  </label>
                  <input
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
                    type="text"
                    placeholder="e.g. Annual Leave, Sick Leave"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setFormErrors((prev) => ({ ...prev, name: undefined }));
                    }}
                  />
                  {formErrors.name && (
                    <span className="!mt-1 text-sm text-red-500 font-medium">
                      {formErrors.name}
                    </span>
                  )}
                </div>

                <div className="flex flex-col items-start">
                  <label className="flex justify-between w-full pb-1 mb-1 text-sm font-medium text-gray-500 font-small">
                    Unit*
                  </label>
                  <select
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
                    value={unit}
                    onChange={(e) => {
                      setUnit(e.target.value);
                      setFormErrors((prev) => ({ ...prev, unit: undefined }));
                    }}
                  >
                    <option value="Days">Days</option>
                    <option value="Hours">Hours</option>
                  </select>
                  {formErrors.unit && (
                    <span className="!mt-1 text-sm text-red-500 font-medium">
                      {formErrors.unit}
                    </span>
                  )}
                </div>

                <div className="flex flex-col items-start">
                  <label className="flex justify-between w-full pb-1 mb-1 text-sm font-medium text-gray-500 font-small">
                    Maximum Allowed*
                  </label>
                  <input
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
                    type="number"
                    step="0.5"
                    min="0"
                    value={maximumAllowed}
                    onChange={(e) => {
                      setMaximumAllowed(Number(e.target.value));
                      setFormErrors((prev) => ({ ...prev, maximumAllowed: undefined }));
                    }}
                  />
                  {formErrors.maximumAllowed && (
                    <span className="!mt-1 text-sm text-red-500 font-medium">
                      {formErrors.maximumAllowed}
                    </span>
                  )}
                </div>

                <div className="flex flex-col items-start">
                  <label className="flex justify-between w-full pb-1 mb-1 text-sm font-medium text-gray-500 font-small">
                    Max Carry Over*
                  </label>
                  <input
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
                    type="number"
                    step="0.5"
                    min="0"
                    value={maxCarryOver}
                    onChange={(e) => {
                      setMaxCarryOver(Number(e.target.value));
                      setFormErrors((prev) => ({ ...prev, maxCarryOver: undefined }));
                    }}
                  />
                  {formErrors.maxCarryOver && (
                    <span className="!mt-1 text-sm text-red-500 font-medium">
                      {formErrors.maxCarryOver}
                    </span>
                  )}
                </div>

                <div className="flex flex-col items-start">
                  <label className="flex justify-between w-full pb-1 mb-1 text-sm font-medium text-gray-500 font-small">
                    Expire Month (1-12)*
                  </label>
                  <input
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
                    type="number"
                    min="1"
                    max="12"
                    value={expireMonth}
                    onChange={(e) => {
                      setExpireMonth(Number(e.target.value));
                      setFormErrors((prev) => ({ ...prev, expireMonth: undefined }));
                    }}
                  />
                  {formErrors.expireMonth && (
                    <span className="!mt-1 text-sm text-red-500 font-medium">
                      {formErrors.expireMonth}
                    </span>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="flex w-full pb-1 mb-1 text-sm font-medium text-gray-500 font-small">
                    Description*
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
                    placeholder="Write description here..."
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                      setFormErrors((prev) => ({ ...prev, description: undefined }));
                    }}
                  ></textarea>
                  {formErrors.description && (
                    <span className="!mt-1 text-sm text-red-500 font-medium">
                      {formErrors.description}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between mt-8">
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
