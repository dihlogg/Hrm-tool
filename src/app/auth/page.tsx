"use client";

import { useLogin } from "@/hooks/auth/useLogin";
import { API_ENDPOINTS } from "@/services/apiService";
import { setAuthCookies } from "@/utils/auth";
import { UserOutlined, KeyOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const { login, error } = useLogin();

  const handleLogin = async () => {
    await login(userName, password);
  };

  return (
    <div className="flex items-center justify-start w-full h-screen overflow-hidden bg-orange-500">
      <div className="relative h-full w-full bg-white rounded-r-[100px] sm:rounded-r-[100px] lg:rounded-r-[9999px] flex items-center justify-center sm:w-[95%] md:w-[90%] lg:w-[85%] xl:w-[80%]">
        <div className="z-10 flex flex-col items-center w-full max-w-sm px-6 py-8 gap-y-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 sm:max-w-md lg:max-w-lg xl:max-w-xl">
          <h1 className="text-4xl !font-extrabold text-[#64728C] text-center mb-2">
            Login
          </h1>
          <div className="flex flex-col w-full p-4 space-y-3 text-gray-600 bg-gray-100 sm:p-6 sm:bg-gray-200 rounded-2xl sm:flex-row sm:space-y-0 sm:space-x-6 sm:justify-center lg:justify-between">
            <div className="text-center sm:text-left">
              <span className="block text-sm tracking-wide text-gray-400">
                Username
              </span>
              <span className="text-sm font-medium text-gray-700 sm:text-base lg:text-lg">
                LongAuthen
              </span>
            </div>
            <div className="text-center sm:text-left">
              <span className="block text-sm tracking-wide text-gray-400">
                Password
              </span>
              <span className="text-sm font-medium text-gray-700 sm:text-base lg:text-lg">
                171204
              </span>
            </div>
          </div>

          <div className="flex flex-col w-full gap-6 sm:gap-8">
            <div className="flex flex-col items-start w-full">
              <label className="flex items-center gap-3 mb-1 text-sm font-medium text-gray-600">
                <UserOutlined size={20} />
                Username
              </label>
              <input
                className="w-full px-3 py-3 text-base !text-gray-600 placeholder-gray-400 transition-all duration-300 bg-white border-2 border-gray-200 sm:text-base rounded-2xl focus:outline-none focus:ring-1 focus:ring-blue-100 focus:border-blue-400 placeholder:text-sm hover:border-gray-300"
                type="text"
                placeholder="Enter your username"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>

            <div className="flex flex-col items-start w-full">
              <label className="flex items-center gap-3 mb-1 text-sm font-medium text-gray-600">
                <KeyOutlined size={20} />
                Password
              </label>
              <input
                className="w-full px-3 py-3 text-base !text-gray-600 placeholder-gray-400 transition-all duration-300 bg-white border-2 border-gray-200 sm:text-base rounded-2xl focus:outline-none focus:ring-1 focus:ring-blue-100 focus:border-blue-400 placeholder:text-sm hover:border-gray-300"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              className="w-full px-4 py-4 text-sm font-bold text-white transition-all duration-300 bg-orange-500 cursor-pointer rounded-3xl hover:bg-orange-400 hover:shadow-2xl hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-orange-300 focus:bg-orange-400 active:scale-95 active:translate-y-0"
              onClick={handleLogin}
            >
              Login
            </button>

            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
          </div>

          <a className="px-2 py-1 text-base text-orange-500 transition-all duration-200 rounded-md cursor-pointer hover:underline hover:text-orange-600">
            Forgot your password?
          </a>
        </div>
        <div className="absolute top-0 right-0 hidden w-32 h-32 translate-x-16 -translate-y-16 bg-orange-100 rounded-full opacity-20 sm:block"></div>
        <div className="absolute bottom-0 right-0 hidden w-24 h-24 translate-x-12 translate-y-12 bg-orange-200 rounded-full opacity-30 lg:block"></div>
        <div className="absolute right-0 hidden w-16 h-16 translate-x-8 bg-orange-300 rounded-full opacity-25 top-1/2 xl:block"></div>
      </div>
    </div>
  );
}
