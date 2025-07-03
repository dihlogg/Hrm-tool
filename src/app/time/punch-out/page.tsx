"use client";

import { Button, DatePicker, TimePicker } from "antd";

export default function PunchInPage() {
  return (
    <div className="flex-1 w-full p-4 mt-2 space-y-6">
      <div className="px-8 py-6 bg-white border border-gray-200 shadow-sm rounded-xl">
        <h2 className="pb-2 text-xl font-semibold text-gray-500 border-b border-b-gray-400">
          Punch Out
        </h2>

        <div className="grid grid-cols-1 mb-6 sm:grid-cols-2 lg:grid-cols-2">
          <div className="flex flex-col items-start w-full space-y-2">
            <div className="flex flex-row items-center w-full space-x-4">
              <div className="flex flex-col w-full">
                <label
                  id="date"
                  className="w-full mb-2 text-sm text-gray-500 border-gray-200 font-small"
                >
                  Date*
                </label>
                <DatePicker
                  className="h-[40px] w-full rounded-lg"
                  placeholder="Select date"
                />
              </div>
              <div className="flex flex-col w-full">
                <label
                  id="time"
                  className="w-full mb-2 text-sm text-gray-500 border-gray-200 font-small"
                >
                  Time*
                </label>
                <TimePicker
                  className="h-[40px] w-full rounded-lg"
                  use12Hours={true}
                  showSecond={false}
                  placeholder="Select time"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col w-full mt-6">
          <label className="mb-1 text-sm text-gray-500">Note*</label>
          <textarea
            rows={4}
            className="w-1/2 px-3 py-2 mt-1 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
            placeholder="Type here"
          ></textarea>
        </div>

        <div className="flex items-center justify-between mt-6">
          <span className="text-sm italic font-medium text-gray-500">
            * Required
          </span>
          <Button
            type="primary"
            shape="round"
            size="large"
            className="text-white w-[80] bg-blue-500 hover:bg-blue-600"
          >
            Out
          </Button>
        </div>
      </div>
    </div>
  );
}
