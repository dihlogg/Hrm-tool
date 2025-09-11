"use client";

import { Button, message, notification, Select } from "antd";
import { useEffect, useState } from "react";
import { Switch } from "@headlessui/react";
import { useUpdateUser } from "@/hooks/users/useUpdateUser";
import { useSearchParams } from "next/navigation";
import { useGetUserById } from "@/hooks/users/useGetUserById";
import { useUserStatuses } from "@/hooks/users/user-statuses/useUserStatuses";
import { UserDto } from "@/hooks/users/UserDto";

const { Option } = Select;

export default function EditUserPage() {
  const { updateUser } = useUpdateUser();
  const searchParams = useSearchParams();
  const userId = searchParams.get("id") || undefined;
  const { user } = useGetUserById(userId ?? "");
  const { userStatuses, error: userStatusesError } = useUserStatuses();
  const [api, contextHolder] = notification.useNotification();

  const [changePassword, setChangePassword] = useState(false);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ confirmPassword?: string }>(
    {}
  );
  const [userStatusId, setUserStatusId] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<{
    userName?: string;
    password?: string;
    userStatusId?: string;
  }>({});

  useEffect(() => {
    if (user) {
      setUserName(user.userName ?? "");
      setUserStatusId(user.userStatusId ?? null);
    }
  }, [user]);

  const handleSubmit = async () => {
    const errors: typeof formErrors = {};
    if (!userName?.trim()) errors.userName = "*Required";
    if (!userStatusId) errors.userStatusId = "*Required";
    if (changePassword) {
      if (!password?.trim()) errors.password = "*Required";
    }
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      message.warning("Please fill in all required fields before submitting!");
      setFormErrors(errors);
      return;
    }

    try {
      const payload: UserDto = {
        id: userId,
        userName: userName || "",
        userStatusId,
      };
      if (changePassword) {
        payload.password = password;
      }
      await updateUser(userId!, payload);
      api.success({
        message: "User Info Update Successfully!",
        description: `User information has been updated.`,
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

  return (
    <>
      {contextHolder}
      <div className="flex-1 w-full p-4 mt-2 space-y-6">
        {/* Filter Section */}
        <div className="flex-col px-8 py-4 bg-white border-gray-200 rounded-lg shadow-sm sm:flex-row">
          <h2 className="pb-2 text-xl font-semibold text-gray-500 border-b border-b-gray-400">
            Edit User
          </h2>
          <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-2">
            <div className="flex flex-col items-start">
              <label className="w-full mb-1 text-sm text-gray-500 font-small">
                Username
                {formErrors.userName && (
                  <span className="!mt-1 text-sm text-red-500">
                    {formErrors.userName}
                  </span>
                )}
              </label>
              <input
                className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
                type="text"
                placeholder="Type for hints..."
                value={userName}
                onChange={(e) => {
                  setUserName(e.target.value);
                  setFormErrors((prev) => ({
                    ...prev,
                    userName: undefined,
                  }));
                }}
              />
            </div>

            <div>
              <label className="w-full text-sm text-gray-500 font-small">
                Status
                {formErrors.userStatusId && (
                  <span className="!mt-1 text-sm text-red-500">
                    {formErrors.userStatusId}
                  </span>
                )}
              </label>
              <Select
                className="w-full"
                placeholder="--Select--"
                allowClear
                value={userStatusId}
                onChange={(value) => {
                  setUserStatusId(value);
                  setFormErrors((prev) => ({
                    ...prev,
                    userStatusId: undefined,
                  }));
                }}
              >
                {userStatuses.map((status) => (
                  <Option key={status.id} value={status.id}>
                    {status.name}
                  </Option>
                ))}
              </Select>
            </div>
          </div>
          <div className="flex items-center w-full space-x-4 justify-stretch">
            <label className="text-sm font-medium text-gray-500">
              Change Password?
            </label>
            <Switch
              checked={changePassword}
              onChange={setChangePassword}
              className={`${
                changePassword ? "bg-orange-500" : "bg-gray-300"
              } relative inline-flex h-[20px] w-[44px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none`}
            >
              <span
                className={`${
                  changePassword ? "translate-x-6" : "translate-x-0"
                } inline-block h-[16px] w-[16px] transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
              />
            </Switch>
          </div>

          {changePassword && (
            <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 bg-[#F1F5F9] mt-4 px-4 rounded-xl">
              <div className="flex flex-col">
                <label className="flex justify-between mt-4 text-sm text-gray-500">
                  Password
                  {formErrors.password && (
                    <span className="!mt-1 text-sm text-red-500">
                      {formErrors.password}
                    </span>
                  )}
                </label>
                <input
                  className="w-full px-3 py-2 !mt-1 text-sm bg-white border border-gray-200 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
                  type="password"
                  placeholder="Enter new password"
                  value={password || undefined}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setFormErrors((prev) => ({
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
              + Save
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
